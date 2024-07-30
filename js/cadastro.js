document.getElementById('submitBtn').addEventListener('click', async (event) => {
    event.preventDefault();

    // Coleta os dados do formulário
    const nome = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const cidade = document.getElementById('cidade').value;
    const endereco = document.getElementById('endereco').value;
    const telefone = document.getElementById('telefone').value;
    const cpf = document.getElementById('cpf').value;
    const rg = document.getElementById('rg').value;
    const dataNascimento = document.getElementById('datenasci').value;
    const senha = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const tipo = document.getElementById('tipoUser').value;

    // Validação simples de senha
    if (senha !== confirmPassword) {
        exibirAlertaErro('As senhas não coincidem!');
        return;
    }

    // Cria o objeto com os dados do usuário
    const novoUsuario = {
        Nome: nome,
        Email: email,
        Senha: senha,
        CPF: cpf,
        RG: rg,
        Telefone: telefone,
        Endereco: endereco,
        Cidade: cidade,
        Tipo: tipo,
        DataNascimento: dataNascimento
    };

    try {
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUsuario)
        });

        if (response.ok) {
            const data = await response.json();
            exibirAlertaOK('Usuário cadastrado com sucesso!');
            // Limpa o formulário
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('cidade').value = '';
            document.getElementById('endereco').value = '';
            document.getElementById('telefone').value = '';
            document.getElementById('cpf').value = '';
            document.getElementById('rg').value = '';
            document.getElementById('datenasci').value = '';
            document.getElementById('password').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('tipoUser').value = 'secretario';
        } else {
            const errorData = await response.json();
            exibirAlertaErro(`Erro ao cadastrar usuário: ${errorData.error}`);
        }
    } catch (error) {
        exibirAlertaErro(`Erro ao conectar com a API: ${error.message}`);
    }
});
