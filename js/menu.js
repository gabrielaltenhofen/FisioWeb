function logout() {
    document.cookie = 'userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = "index.html";
}


function getCookie(nome) {
    var cookies = document.cookie.split(';'); 
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim(); 
        if (cookie.indexOf(nome + '=') === 0) {
            return cookie.substring(nome.length + 1, cookie.length);
        }
    }
    return null;
}

function exibirRedirecionamento(mensagem, callback) {
    const modalHtml = `
        <div id="alertaModal" class="modal-alert">
            <div class="modalAlert-content">
                <div class="alinhar-centro">
                    <h2><i class="fas fa-check-circle" style="color: green;"></i></h2>
                    <p>${mensagem}</p>
                    <button class="button-alert" id="fecharAlerta"><i class="fas fa-check"></i> OK</button>
                </div>
            </div>
        </div>
    `;

    // Adicionar o modal ao corpo do documento
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('alertaModal');
    const fecharAlertaBtn = document.getElementById('fecharAlerta');

    // Exibir o modal
    modal.style.display = 'block';

    // Fechar o modal ao clicar no botão "OK"
    fecharAlertaBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
        // Executar a callback se fornecida
        if (callback) {
            callback();
        }
    });
}

