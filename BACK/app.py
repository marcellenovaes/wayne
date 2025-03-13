from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from db import get_db_connection, create_tables

app = Flask(__name__)
CORS(app)

# Inicializa as tabelas do banco de dados ao iniciar a API
create_tables()

### --- Rota de Login --- ###
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    login = data.get('login')
    senha = data.get('senha')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE login = ? AND senha = ?", (login, senha))
    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"success": True, "message": "Login bem-sucedido"}), 200
    return jsonify({"success": False, "message": "Usuário ou senha incorretos"}), 401

### --- Rotas para Funcionários --- ###

@app.route('/funcionarios', methods=['POST'])
def add_funcionario():
    data = request.get_json()
    nome = data.get('nome')
    login = data.get('login')
    senha = data.get('senha')
    ativo = data.get('ativo', 1)
    atuacao = data.get('atuacao')
    administrador = data.get('administrador', 1)

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM Funcionarios WHERE login = ?", (login,))
    exists = cursor.fetchone()[0]

    if exists:
        conn.close()
        return jsonify({'message': f'O login "{login}" já está em uso!'}), 400

    cursor.execute(''' 
        INSERT INTO Funcionarios (nome, login, senha, ativo, atuacao, administrador) 
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (nome, login, senha, ativo, atuacao, administrador))

    conn.commit()
    conn.close()
    return jsonify({'message': 'Funcionário criado com sucesso!'}), 201

@app.route('/funcionarios', methods=['GET'])
def get_funcionarios():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Funcionarios')
    funcionarios = cursor.fetchall()
    conn.close()

    funcionarios_lista = [dict(row) for row in funcionarios]
    return jsonify(funcionarios_lista), 200

@app.route('/funcionarios/<int:id>', methods=['PUT'])
def update_funcionario(id):
    data = request.get_json()
    nome = data.get('nome')
    login = data.get('login')
    ativo = data.get('ativo', 1)
    atuacao = data.get('atuacao')
    administrador = data.get('administrador', 1)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(''' 
        UPDATE Funcionarios
        SET nome = ?, login = ?, ativo = ?, atuacao = ?, administrador = ?
        WHERE id = ?
    ''', (nome, login, ativo, atuacao, administrador, id))

    conn.commit()
    conn.close()
    return jsonify({'message': 'Funcionário atualizado com sucesso!'}), 200

@app.route('/funcionarios/<int:id>', methods=['DELETE'])
def delete_funcionario(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM Funcionarios WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Funcionário excluído com sucesso!'}), 200

### --- Rotas para Equipamentos --- ###

@app.route('/equipamentos', methods=['POST'])
def add_equipamento():
    data = request.get_json()
    nome = data.get('nome')
    categoria = data.get('categoria').upper()
    status = int(data.get('status', 1))

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO Equipamentos (nome, categoria, status) VALUES (?, ?, ?)', (nome, categoria, status))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Equipamento criado com sucesso!'}), 201

@app.route('/equipamentos', methods=['GET'])
def get_equipamentos():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Equipamentos')
    equipamentos = cursor.fetchall()
    conn.close()

    equipamentos_lista = [{"id": row["id"], "nome": row["nome"], "categoria": row["categoria"], "status": row["status"]} for row in equipamentos]
    return jsonify(equipamentos_lista), 200

@app.route('/equipamentos/<int:id>', methods=['GET'])
def get_equipamento(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM Equipamentos WHERE id = ?', (id,))
    equipamento = cursor.fetchone()
    conn.close()

    if not equipamento:
        return jsonify({'message': 'Equipamento não encontrado!'}), 404

    equipamento_dict = {
        'id': equipamento["id"],
        'nome': equipamento["nome"],
        'categoria': equipamento["categoria"],
        'status': equipamento["status"]
    }

    return jsonify(equipamento_dict), 200


@app.route('/equipamentos/<int:id>', methods=['PUT'])
def update_equipamento(id):
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'Dados não fornecidos!'}), 400
    
    nome = data.get('nome')
    categoria = data.get('categoria')
    status = data.get('status', 1)  # Padrão 1 se não informado

    if categoria:
        categoria = categoria.upper()
    
    try:
        status = int(status)
    except ValueError:
        return jsonify({'message': 'Status inválido!'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Equipamentos WHERE id = ?', (id,))
    equipamento = cursor.fetchone()

    if not equipamento:
        conn.close()
        return jsonify({'message': 'Equipamento não encontrado!'}), 404

    cursor.execute(
        'UPDATE Equipamentos SET nome = ?, categoria = ?, status = ? WHERE id = ?',
        (nome, categoria, status, id)
    )
    conn.commit()
    conn.close()

    return jsonify({'message': 'Equipamento atualizado com sucesso!'}), 200

@app.route('/equipamentos/<int:id>', methods=['DELETE'])
def delete_equipamento(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM Equipamentos WHERE id = ?', (id,))
    equipamento = cursor.fetchone()

    if not equipamento:
        conn.close()
        return jsonify({'message': 'Equipamento não encontrado!'}), 404

    cursor.execute('DELETE FROM Equipamentos WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Equipamento excluído com sucesso!'}), 200

if __name__ == '__main__':
    app.run(debug=True)
