function checkAccess() {
    const userLevel = getCookie("userLevel"); // Obtém o nível de acesso do usuário do cookie
    const currentPage = window.location.href.split("/").pop(); // Obtém o nome da página atual

    // Defina as permissões de acesso para cada nível de usuário
    const accessPermissions = {
        "paciente": ["menu_cliente.html", "atendimentoscli.html", "dados.html"],

         //Admin
        "fisioterapeuta": ["menu.html", "atendimentos.html", "cadastro.html", "pacientes.html"]
    };

    // Verifica se o usuário tem permissão para acessar a página atual com base no nível de acesso
    if (!userLevel || !accessPermissions[userLevel].includes(currentPage)) {
        // Armazena a página atual para redirecionar o usuário de volta após a mensagem de erro
        sessionStorage.setItem('redirectFrom', currentPage);

        // Redireciona para a página de login ou outra página adequada
        window.location.href = "index.html";
    }
}

// Verifica o acesso quando a página carrega
checkAccess();


// Função para obter o valor de um cookie pelo nome
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}
checkAccess();
