// Adicione aqui a lógica para lidar com o envio do formulário, 
// validação dos campos, interação com os botões de login social, etc.

// Exemplo simples de validação de e-mail:
const emailInput = document.getElementById('email');

emailInput.addEventListener('input', () => {
    if (validateEmail(emailInput.value)) {
        emailInput.setCustomValidity(''); 
    } else {
        emailInput.setCustomValidity('Por favor, insira um e-mail válido.'); 
    }
});

function validateEmail(email) {
    // Expressão regular para validação básica de e-mail
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// ---------


// Funcionalidade do Botão de Visualizar e Esconder Senha do Input

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
}