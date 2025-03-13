import sqlite3

DATABASE_NAME = 'database.db'  # Nome do banco de dados

def get_db_connection():
    try:
        conn = sqlite3.connect(DATABASE_NAME, check_same_thread=False)  # Permite múltiplas conexões
        conn.row_factory = sqlite3.Row  # Permite acessar colunas por nome
        return conn
    except sqlite3.Error as e:
        print("Erro ao conectar ao banco de dados:", e)
        return None

def create_tables():
    conn = get_db_connection()
    if conn is None:
        print("Erro: não foi possível conectar ao banco de dados.")
        return

    cursor = conn.cursor()

    try:
        # Criar tabela de usuários (login)
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL
            )
        ''')

        # Criar tabela de funcionários
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS Funcionarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                login TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                ativo INTEGER DEFAULT 1,
                atuacao TEXT NOT NULL,
                administrador INTEGER DEFAULT 1
            )
        ''')

        # Criar tabela de equipamentos
        cursor.execute(''' 
            CREATE TABLE IF NOT EXISTS Equipamentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                categoria TEXT NOT NULL,
                status INTEGER DEFAULT 1
            )
        ''')

        conn.commit()  # Garante que as tabelas sejam criadas no disco
        print("Tabelas criadas com sucesso!")

    except sqlite3.Error as e:
        print("Erro ao criar tabelas:", e)

    finally:
        conn.close()

# Chamar a criação das tabelas ao rodar este arquivo
if __name__ == '__main__':
    create_tables()