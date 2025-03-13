
// Equipamentos por Status Chart
var ctx1 = document.getElementById('equipamentoStatusChart').getContext('2d');
var equipamentoStatusChart = new Chart(ctx1, {
    type: 'pie',
    data: {
        labels: ['Disponível', 'Indisponível', 'Em Manutenção'],
        datasets: [{
            label: 'Equipamentos',
            data: [30, 50, 20],  // Dados de exemplo
            backgroundColor: ['#00FF00', '#FF0000', '#FFA500'],
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                    }
                }
            }
        }
    }
});

// Funcionários Ativos e Inativos Chart
var ctx2 = document.getElementById('funcionarioStatusChart').getContext('2d');
var funcionarioStatusChart = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Ativos', 'Inativos'],
        datasets: [{
            label: 'Funcionários',
            data: [70, 30],  // Dados de exemplo
            backgroundColor: ['#4CAF50', '#FF0000'],
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true
            }
        }
    }
});

// Adicionar Funcionário
document.getElementById('addFuncionarioBtn').addEventListener('click', function() {
    var tableBody = document.getElementById('funcionarioTableBody');
    var newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>1</td>  <!-- ID de exemplo -->
        <td>John Doe</td>  <!-- Nome de exemplo -->
        <td>johndoe</td>  <!-- Login de exemplo -->
        <td>Ativo</td>  <!-- Status de exemplo -->
        <td><button class="btn btn-outline-light">Editar</button></td>
    `;
    
    tableBody.appendChild(newRow);
});

// Adicionar Equipamento
document.getElementById('addEquipamentoBtn').addEventListener('click', function() {
    var tableBody = document.getElementById('equipamentoTableBody');
    var newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>1</td>  <!-- ID de exemplo -->
        <td>Computador</td>  <!-- Nome de exemplo -->
        <td>Informática</td>  <!-- Categoria de exemplo -->
        <td>Disponível</td>  <!-- Status de exemplo -->
        <td><button class="btn btn-outline-light">Editar</button></td>
    `;
    
    tableBody.appendChild(newRow);
});

// Aguardar o carregamento completo do DOM antes de manipular
document.addEventListener('DOMContentLoaded', function() {
const funcionarioTableBody = document.getElementById('funcionarioTableBody');
const equipamentoTableBody = document.getElementById('equipamentoTableBody');

// Carregar Funcionários
function loadFuncionarios() {
fetch('http://127.0.0.1:5000/funcionarios')
    .then(response => response.json())
    .then(data => {
        funcionarioTableBody.innerHTML = '';
        data.forEach(funcionario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${funcionario.id}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.login}</td>
                <td>${funcionario.ativo === 1 ? 'Ativo' : 'Inativo'}</td>
                <td>
                    <button class="btn btn-warning">Editar</button>
                    <button class="btn btn-danger">Excluir</button>
                </td>
            `;
            funcionarioTableBody.appendChild(row);
        });
    })
    .catch(err => console.error('Erro ao carregar funcionários:', err));
}

// Carregar Equipamentos
function loadEquipamentos() {
fetch('http://127.0.0.1:5000/equipamentos')
    .then(response => response.json())
    .then(data => {
        equipamentoTableBody.innerHTML = '';
        data.forEach(equipamento => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${equipamento.id}</td>
                <td>${equipamento.nome}</td>
                <td>${equipamento.categoria}</td>
                <td>${equipamento.status === 1 ? 'Disponível' : 'Indisponível'}</td>
                <td>
                    <button class="btn btn-warning">Editar</button>
                    <button class="btn btn-danger">Excluir</button>
                </td>
            `;
            equipamentoTableBody.appendChild(row);
        });
    })
    .catch(err => console.error('Erro ao carregar equipamentos:', err));
}

// Carregar Gráficos
function loadCharts() {
// Carregar dados de equipamentos
fetch('http://127.0.0.1:5000/equipamentos')
    .then(response => response.json())
    .then(data => {
        const statusCount = { 1: 0, 0: 0 };
        data.forEach(equipamento => {
            statusCount[equipamento.status]++;
        });

        const ctxEquipamentoStatus = document.getElementById('equipamentoStatusChart').getContext('2d');
        new Chart(ctxEquipamentoStatus, {
            type: 'pie',
            data: {
                labels: ['Disponível', 'Indisponível'],
                datasets: [{
                    data: [statusCount[1], statusCount[0]],
                    backgroundColor: ['#28a745', '#dc3545']
                }]
            }
        });
    })
    .catch(err => console.error('Erro ao carregar gráfico de equipamentos:', err));

// Carregar dados de funcionários
fetch('http://127.0.0.1:5000/funcionarios')
    .then(response => response.json())
    .then(data => {
        const ativoCount = { 1: 0, 0: 0 };
        data.forEach(funcionario => {
            ativoCount[funcionario.ativo]++;
        });

        const ctxFuncionarioStatus = document.getElementById('funcionarioStatusChart').getContext('2d');
        new Chart(ctxFuncionarioStatus, {
            type: 'pie',
            data: {
                labels: ['Ativo', 'Inativo'],
                datasets: [{
                    data: [ativoCount[1], ativoCount[0]],
                    backgroundColor: ['#28a745', '#dc3545']
                }]
            }
        });
    })
    .catch(err => console.error('Erro ao carregar gráfico de funcionários:', err));
}

// Carregar dados ao abrir a página
loadFuncionarios();
loadEquipamentos();
loadCharts();
});

