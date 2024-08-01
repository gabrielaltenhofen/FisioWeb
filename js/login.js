document.getElementById('login-button').addEventListener('click', login);

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        Email: email,
        Senha: password
    };

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (response.ok) {
            // Pega o primeiro nome cortando no primeiro espaço
            const primeiroNome = data.user.nome.split(' ')[0];

            // Armazena o primeiro nome do usuário em um cookie
            document.cookie = `userName=${primeiroNome}; path=/`;
            document.cookie = `userLevel=${data.userLevel}; path=/`;

            // Redireciona para a página do menu
            window.location.href = 'menu.html';
        } else {
            exibirAlertaErro(data.message || 'Erro no login');
        }
    } catch (error) {
        exibirAlertaErro('Erro ao conectar com a API: ' + error.message);
    }
}

function exibirAlertaErro(mensagem) {
    alert(mensagem);
}

function onChangeEmail() {
    const email = document.getElementById('email').value;
    document.getElementById('login-button').disabled = !email;
}

function onChangePassword() {
    const password = document.getElementById('password').value;
    document.getElementById('login-button').disabled = !password;
}
