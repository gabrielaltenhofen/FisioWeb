document.addEventListener('DOMContentLoaded', async () => {
    const atendimentosTableBody = document.querySelector('#atendimentosTable tbody');

    async function loadAtendimentos() {
        try {
            const userId = getId('userId'); // Extrai o userId dos cookies
            if (!userId) {
                exibirAlertaErro('Usuário não autenticado');
                return;
            }

            const response = await fetch(`http://localhost:3000/atendimentos/${userId}`);
            const data = await response.json();
            if (response.ok) {
                atendimentosTableBody.innerHTML = ''; // Limpa o conteúdo existente antes de adicionar novos
                data.forEach(atendimento => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${atendimento.pacientenome}</td>
                        <td>${atendimento.profissionalnome}</td>
                        <td>${atendimento.data}</td>
                        <td>${atendimento.hora}</td>
                        <td>${atendimento.horariosaida}</td>
                    `;
                    atendimentosTableBody.appendChild(row);
                });
            } else {
                exibirAlertaErro('Erro ao carregar atendimentos');
            }
        } catch (error) {
            exibirAlertaErro('Erro ao conectar com a API: ' + error.message);
        }
    }

    await loadAtendimentos();
});

function getId(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
