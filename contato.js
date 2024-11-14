document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = this.querySelector('#nome').value;
    const email = this.querySelector('#email').value;
    const telefone = this.querySelector('#telefone').value;
    const mensagem = this.querySelector('#mensagem').value;

    fetch('/contato', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, telefone, mensagem }),
    })
    .then(response => {
        if (response.ok) {
            alert('Mensagem enviada com sucesso!'); 
            this.reset(); 
        } else {
            alert('Erro ao enviar a mensagem: ' + response.statusText);
        }
    })
    .catch(error => {
        alert('Erro: ' + error.message);
    });
});