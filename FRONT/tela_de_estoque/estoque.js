document.addEventListener('DOMContentLoaded', function () {
    const equipamentoForm = document.getElementById('equipamentoForm');
    const equipamentoTableBody = document.getElementById('equipamentoTable');
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    let editId = null;

    // Adicionar Equipamento
    equipamentoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const nome = document.getElementById('nomeEquipamento').value;
        const categoria = document.getElementById('categoria').value;
        const status = parseInt(document.getElementById('status').value);

        fetch('http://127.0.0.1:5000/equipamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, categoria, status })
        })
        .then(response => response.json())
        .then(() => {
            alert("Equipamento adicionado com sucesso!");
            listarEquipamentos();
            equipamentoForm.reset();
        })
        .catch(error => console.error('Erro ao adicionar equipamento:', error));
    });

    // Listar Equipamentos
    function listarEquipamentos() {
        fetch('http://127.0.0.1:5000/equipamentos')
        .then(response => response.json())
        .then(equipamentos => {
            equipamentoTableBody.innerHTML = '';
            equipamentos.forEach(equipamento => {
                const newRow = equipamentoTableBody.insertRow();
                newRow.innerHTML = `
                    <td>${equipamento.id}</td>
                    <td>${equipamento.nome}</td>
                    <td>${equipamento.categoria}</td>
                    <td>${equipamento.status == 1 ? 'Disponível' : 'Indisponível'}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editEquipamento(${equipamento.id})">Editar</button>
                        <button class="btn btn-danger" onclick="deleteEquipamento(${equipamento.id})">Excluir</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Erro ao listar equipamentos:', error));
    }

    // Editar Equipamento
    window.editEquipamento = function(id) {
        fetch(`http://127.0.0.1:5000/equipamentos/${id}`)
        .then(response => response.json())
        .then(equipamento => {
            document.getElementById('editNome').value = equipamento.nome;
            document.getElementById('editCategoria').value = equipamento.categoria;
            document.getElementById('editStatus').value = equipamento.status.toString();
            editId = id; // Guardar ID
            editModal.show();
        })
        .catch(error => {
            console.error('Erro ao carregar equipamento para edição:', error);
            alert('Erro ao carregar dados do equipamento');
        });
    };

    // Salvar Edição
    document.getElementById('saveEdit').addEventListener('click', function () {
        if (editId === null) return;

        const nome = document.getElementById('editNome').value;
        const categoria = document.getElementById('editCategoria').value;
        const status = parseInt(document.getElementById('editStatus').value);

        fetch(`http://127.0.0.1:5000/equipamentos/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, categoria, status })
        })
        .then(response => response.json())
        .then(() => {
            alert('Equipamento atualizado com sucesso!');
            listarEquipamentos();
            editModal.hide();
        })
        .catch(error => {
            console.error('Erro ao atualizar equipamento:', error);
            alert('Erro ao atualizar equipamento');
        });
    });

    // Excluir Equipamento
    window.deleteEquipamento = function(id) {
        if (confirm('Tem certeza que deseja excluir este equipamento?')) {
            fetch(`http://127.0.0.1:5000/equipamentos/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(() => {
                alert('Equipamento excluído com sucesso!');
                listarEquipamentos();
            })
            .catch(error => console.error('Erro ao excluir equipamento:', error));
        }
    };

    listarEquipamentos();
});