const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');
const path = require('path');
const multer = require('multer');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'img')));


// Configuração da sessão
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'img')); 
    },
    filename: (req, file, cb) => {
        const userId = req.session.user.id;
        const ext = path.extname(file.originalname);
        cb(null, `profile_${userId}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas!'));
    }
});

// middleware para verificar autenticação em rotas protegidas
function verificarAutenticacao(req, res, next) {
    if (req.session.user) {
        next(); // usuário autenticado, segue para a rota
    } else {
        res.redirect('/'); // redireciona para a página inicial se não estiver autenticado
    }
}

// rota inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/areaAluno.html'));
});

// rota de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM usuario WHERE email = ? AND senha = ?';
    connection.query(query, [email, senha], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            req.session.user = { 
                id: 
                 results[0].id,nome:
                 results[0].nome, senha: 
                 results[0].senha, email:
                 results[0].email };
            console.log('Usuário logado:', req.session.user);
            return res.redirect('/portalAluno');
        } else {
            res.status(401).send('E-mail ou senha incorretos!');
        }
    });
});

// rota de cadastro
app.post('/cadastro', (req, res) => {
    const { nome, email, senha, profilePic } = req.body;

    const checkUserQuery = 'SELECT * FROM usuario WHERE email = ?';
    connection.query(checkUserQuery, [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            return res.status(409).send('Usuário já existe');
        }

        const insertUserQuery = 'INSERT INTO usuario (nome, email, senha, profilePic) VALUES (?, ?, ?, ?)';
        connection.query(insertUserQuery, [nome, email, senha, profilePic], (err, results) => {
            if (err) throw err;

            req.session.user = { id: results.insertId, email };
            console.log('Usuário registrado:', req.session.user);
            res.redirect('/portalAluno');
        });
    });
});

// Rota para enviar contato
app.post('/contato', (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    // Verificar se todos os campos foram preenchidos
    if (!nome || !email || !telefone || !mensagem) {
        return res.json({ success: false, message: 'Todos os campos são obrigatórios.' });
    }

    // Inserir os dados de contato no banco de dados
    connection.query(
        'INSERT INTO contato (nome, email, telefone, mensagem) VALUES (?, ?, ?, ?)', 
        [nome, email, telefone, mensagem], 
        (err, results) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: 'Erro ao enviar a mensagem.' });
            }

            // Caso a inserção seja bem-sucedida
            res.json({ success: true, message: 'Mensagem enviada com sucesso!' });
        }
    );
});
