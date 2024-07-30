function exibirAlertaOK(mensagem) {
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
      // Remover o modal do DOM após fechar
      modal.remove();
    });
  }
  
  function exibirAlertaErro(mensagem) {
    const modalHtml = `
      <div id="alertaModal" class="modal-alert">
        <div class="modalAlert-content">
          <div class="alinhar-centro"> 
            <h2><i class="fas fa-exclamation-circle" style="color: red;"></i></h2>
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
      // Remover o modal do DOM após fechar
      modal.remove();
    });
  }
  