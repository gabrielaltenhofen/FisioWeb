document.addEventListener('DOMContentLoaded', async () => {
    const atendimentoFormContainer = document.getElementById('atendimentoFormContainer');
    const createAtendimentoButton = document.getElementById('createAtendimentoButton');
    const atendimentoForm = document.getElementById('atendimentoForm');
    const cancelButton = document.getElementById('cancelButton');
    const pacientesSelect = document.getElementById('paciente');
    const profissionaisSelect = document.getElementById('profissional');
    const atendimentosTableBody = document.querySelector('#atendimentosTable tbody');

    createAtendimentoButton.addEventListener('click', () => {
        atendimentoFormContainer.style.display = 'block';
    });

    cancelButton.addEventListener('click', () => {
        atendimentoFormContainer.style.display = 'none';
    });

    atendimentoForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const pacienteId = pacientesSelect.value;
        const profissionalId = profissionaisSelect.value;
        const data = document.getElementById('data').value;
        const horario = document.getElementById('hora').value;
        const horarioSaida = document.getElementById('horarioSaida').value; // Verifique se esse campo existe no HTML
        const cid = "123"; // Ajuste conforme necessário

        try {
            // Verifica a disponibilidade do profissional
            const disponibilidadeResponse = await fetch('http://localhost:3000/disponibilidade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    profissionalId,
                    data,
                    horario,
                    horarioSaida
                })
            });

            const disponibilidadeData = await disponibilidadeResponse.json();

            if (!disponibilidadeData.disponível) {
                return exibirAlertaErro('Profissional não disponível nesse horário.');
            }

            // Se o profissional estiver disponível, cria o atendimento
            const atendimentoResponse = await fetch('http://localhost:3000/atendimentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pacienteId,
                    profissionalId,
                    data,
                    horario,
                    cid,
                    horarioSaida
                })
            });

            const atendimentoData = await atendimentoResponse.json();

            if (atendimentoResponse.ok) {
                loadAtendimentos();
                atendimentoFormContainer.style.display = 'none';
                atendimentoForm.reset();
            } else {
                exibirAlertaErro(atendimentoData.message || 'Erro ao criar atendimento');
            }
        } catch (error) {
            exibirAlertaErro('Erro ao conectar com a API: ' + error.message);
        }
    });

    async function loadPacientes() {
        try {
            const response = await fetch('http://localhost:3000/pacientes');
            const data = await response.json();
            if (response.ok) {
                pacientesSelect.innerHTML = ''; // Limpa o conteúdo existente antes de adicionar novos
                data.forEach(paciente => {
                    const option = document.createElement('option');
                    option.value = paciente.id;
                    option.textContent = paciente.nome;
                    pacientesSelect.appendChild(option);
                });
            } else {
                exibirAlertaErro('Erro ao carregar pacientes');
            }
        } catch (error) {
            exibirAlertaErro('Erro ao conectar com a API: ' + error.message);
        }
    }

    async function loadProfissionais() {
        try {
            const response = await fetch('http://localhost:3000/profissionais');
            const data = await response.json();
            if (response.ok) {
                profissionaisSelect.innerHTML = ''; // Limpa o conteúdo existente antes de adicionar novos
                data.forEach(profissional => {
                    const option = document.createElement('option');
                    option.value = profissional.id;
                    option.textContent = profissional.nome;
                    profissionaisSelect.appendChild(option);
                });
            } else {
                exibirAlertaErro('Erro ao carregar profissionais');
            }
        } catch (error) {
            exibirAlertaErro('Erro ao conectar com a API: ' + error.message);
        }
    }

    async function loadAtendimentos() {
        try {
            const response = await fetch('http://localhost:3000/atendimentos');
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

    await loadPacientes();
    await loadProfissionais();
    await loadAtendimentos();
});
