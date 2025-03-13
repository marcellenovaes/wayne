document.addEventListener('DOMContentLoaded', function () {
    const funcionarioForm = document.getElementById('funcionarioForm');
    const funcionarioTableBody = document.getElementById('funcionarioTableBody');
    const errorMessage = document.getElementById('errorMessage'); // Adicionando um espaço para exibir mensagens de erro

    // Função para carregar os funcionários da API
    function carregarFuncionarios() {
        fetch('http://127.0.0.1:5000/funcionarios')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição para /funcionarios');
                }
                return response.json();
            })
            .then(data => {
                data.forEach(funcionario => {
                    addFuncionarioRow(funcionario.id, funcionario.nome, funcionario.login, funcionario.atuacao, funcionario.administrador, funcionario.ativo);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar os funcionários:', error);
                errorMessage.textContent = `Ocorreu um erro ao carregar os funcionários: ${error.message}`;
            });
    }

    // Função para adicionar um novo funcionário
    funcionarioForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Capturando os dados do formulário
        const nome = document.getElementById('nome').value;
        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;
        const atuacao = document.getElementById('atuacao').value;
        const administrador = document.getElementById('administrador').checked;
        const ativo = document.getElementById('ativo').checked;

        // Adicionando o funcionário via API
        fetch('http://127.0.0.1:5000/funcionarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, login, senha, atuacao, administrador, ativo }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Funcionário criado com sucesso!') {
                addFuncionarioRow(data.id, nome, login, atuacao, administrador, ativo);
                funcionarioForm.reset();
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = `Ocorreu um erro ao adicionar o funcionário: ${error.message}`;
        });
    });

    // Função para adicionar a linha na tabela
    function addFuncionarioRow(id, nome, login, atuacao, administrador, ativo) {
        const newRow = funcionarioTableBody.insertRow();
        newRow.setAttribute("data-id", id);
        newRow.innerHTML = `
            <td>${id}</td>
            <td>${nome}</td>
            <td>${login}</td>
            <td>${atuacao}</td>
            <td>${administrador ? 'Sim' : 'Não'}</td>
            <td>${ativo ? 'Ativo' : 'Inativo'}</td>
            <td>
                <button class="btn btn-warning" onclick="editFuncionarioRow(${id})">Editar</button>
                <button class="btn btn-danger" onclick="deleteFuncionarioRow(${id})">Excluir</button>
            </td>
        `;
    }

    // Função para editar o funcionário
    window.editFuncionarioRow = function(id) {
        const row = document.querySelector(`#funcionarioTableBody tr[data-id="${id}"]`);
        const nome = row.cells[1].textContent;
        const login = row.cells[2].textContent;
        const atuacao = row.cells[3].textContent;
        const administrador = row.cells[4].textContent === 'Sim';
        const ativo = row.cells[5].textContent === 'Ativo';

        document.getElementById('editNome').value = nome;
        document.getElementById('editLogin').value = login;
        document.getElementById('editAtuacao').value = atuacao;
        document.getElementById('editAdministrador').checked = administrador;
        document.getElementById('editAtivo').checked = ativo;

        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();

        // Salvar alterações
        document.getElementById('saveChanges').onclick = function() {
            const newNome = document.getElementById('editNome').value;
            const newLogin = document.getElementById('editLogin').value;
            const newAtuacao = document.getElementById('editAtuacao').value;
            const newAdministrador = document.getElementById('editAdministrador').checked;
            const newAtivo = document.getElementById('editAtivo').checked;

            fetch(`http://127.0.0.1:5000/funcionarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },


                body: JSON.stringify({
                    nome: newNome,
                    login: newLogin,
                    atuacao: newAtuacao,
                    administrador: newAdministrador,
                    ativo: newAtivo
                }),
            })
            .then(response => {
                if (!response.ok) {
                    // Se a resposta do servidor não for bem-sucedida (status não 2xx)
                    throw new Error(`Erro na atualização: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                // Verificando se o campo 'message' existe na resposta
                if (data && data.message === 'Funcionário atualizado com sucesso!') {
                    // Atualizando a linha da tabela
                    row.cells[1].textContent = newNome;
                    row.cells[2].textContent = newLogin;
                    row.cells[3].textContent = newAtuacao;
                    row.cells[4].textContent = newAdministrador ? 'Sim' : 'Não';
                    row.cells[5].textContent = newAtivo ? 'Ativo' : 'Inativo';
            
                    // Fechar o modal de edição
                    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
                    editModal.hide();
                } else {
                    // Caso o campo 'message' não exista ou seja diferente da esperada
                    throw new Error(data.message || 'Erro desconhecido na resposta');
                }
            })
            .catch(error => {
                // Captura de qualquer erro durante a requisição ou no processamento da resposta
                console.error('Erro ao atualizar o funcionário:', error);
                errorMessage.textContent = `Erro ao atualizar o funcionário: ${error.message}`;
            });
        };
    };

    // Função para excluir um funcionário
    window.deleteFuncionarioRow = function(id) {
        if (confirm('Tem certeza que deseja excluir este funcionário?')) {
            fetch(`http://127.0.0.1:5000/funcionarios/${id}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Funcionário excluído com sucesso!') {
                    const row = document.querySelector(`#funcionarioTableBody tr[data-id="${id}"]`);
                    row.parentNode.removeChild(row);
                } else {
                    throw new Error(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorMessage.textContent = `Ocorreu um erro ao excluir o funcionário: ${error.message}`;
            });
        }
    };

    // Carregar os funcionários ao carregar a página
    carregarFuncionarios();
});