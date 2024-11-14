const btnLogin = document.querySelector('.btnLogin');
const wrapper = document.querySelector('.wrapper');
const overlay = document.querySelector('.overlay');
const iconClose = document.querySelector('.icon-close');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');
const updateLink = document.querySelector('.update-link');

// Abre o popup de login ao clicar no botão de login
btnLogin.addEventListener('click', () => {
    wrapper.classList.add('show');
    overlay.classList.add('show');
    wrapper.querySelector('.form-box.login').style.display = 'block';
    wrapper.querySelector('.form-box.register').style.display = 'none';
    wrapper.querySelector('.form-box.update').style.display = 'none';
});

// Fecha o popup
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('show');
    overlay.classList.remove('show');
});

// Abre o formulário de registro
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.querySelector('.form-box.login').style.display = 'none';
    wrapper.querySelector('.form-box.register').style.display = 'block';
    wrapper.querySelector('.form-box.update').style.display = 'none';
});

// Abre o formulário de login
loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.querySelector('.form-box.register').style.display = 'none';
    wrapper.querySelector('.form-box.login').style.display = 'block';
    wrapper.querySelector('.form-box.update').style.display = 'none';
});

// Abre o formulário de atualização de senha
updateLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.querySelector('.form-box.login').style.display = 'none';
    wrapper.querySelector('.form-box.register').style.display = 'none';
    wrapper.querySelector('.form-box.update').style.display = 'block';
});
