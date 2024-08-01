document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/profissionais');
        const data = await response.json();

        if (response.ok) {
            const tableBody = document.querySelector('#pacientesTable tbody');
            data.forEach(paciente => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${paciente.id}</td>
                    <td>${paciente.nome}</td>
                    <td>${paciente.email}</td>
                    <td>${paciente.telefone}</td>
                    <td>${paciente.endereco}</td>
                    <td>${paciente.cidade}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            exibirAlertaErro('Erro ao buscar pacientes: ' + (data.message || 'Erro desconhecido'));
        }
    } catch (error) {
        exibirAlertaErro('Erro ao conectar com a API: ' + error.message);
    }
});
