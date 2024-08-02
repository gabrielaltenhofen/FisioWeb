document.addEventListener('DOMContentLoaded', async () => {
    // Obtém o ID do usuário a partir do cookie
    const cookies = document.cookie.split('; ');
    let userId = null;
    cookies.forEach(cookie => {
        const [key, value] = cookie.split('=');
        if (key === 'userId') {
            userId = value;
        }
    });

    if (userId) {
        try {
            const response = await fetch(`http://localhost:3000/dados/paciente/${userId}`);
            if (response.ok) {
                const data = await response.json();
                const usuario = data[0];

                // Preenche os inputs com os dados retornados
                document.getElementById('name').value = usuario.nome;
                document.getElementById('email').value = usuario.email;
                document.getElementById('cidade').value = usuario.cidade;
                document.getElementById('endereco').value = usuario.endereco;
                document.getElementById('telefone').value = usuario.telefone;
                document.getElementById('cpf').value = usuario.cpf;
                document.getElementById('rg').value = usuario.rg;
                document.getElementById('datenasci').value = usuario.datanascimento.split('T')[0];
                document.getElementById('lastPassword').value = '';
                document.getElementById('password').value = ''; // Não preencher por segurança
                document.getElementById('confirmPassword').value = ''; // Não preencher por segurança
            
            } else {
                exibirAlertaErro('Erro ao buscar dados do usuário.');
            }
        } catch (error) {
            exibirAlertaErro(`Erro ao conectar com a API: ${error.message}`);
        }
    } else {
        exibirAlertaErro('ID do usuário não encontrado.');
    }
});
