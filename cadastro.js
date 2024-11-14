document.querySelector('.form-box.login form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = this.querySelector('input[type="email"]').value;
    const senha = this.querySelector('input[type="password"]').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "";
        } else {
            alert('E-mail ou senha incorretos!');
        }
    })
    .catch(error => console.error('Erro:', error));
});

document.querySelector('.form-box.register form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const senha = this.querySelector('input[type="password"]').value;

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
    })
    .then(response => {
        if (response.ok) {
            alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
            location.reload();
        } else {
            alert('Erro ao cadastrar: ' + response.statusText);
        }
    })
    .catch(error => console.error('Erro:', error));
});

document.getElementById('updatePasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('updateEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert("As senhas não coincidem. Tente novamente.");
        return;
    }

    // Enviar a solicitação de atualização de senha
    fetch('/atualizarSenha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Senha atualizada com sucesso!");
            window.location.href = '';
        } else {
            alert(data.message); 
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});