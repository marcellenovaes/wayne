document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('cadastroForm');
    const loginInput = document.getElementById('login');
    const senhaInput = document.getElementById('senha');
    
    // Função de login
    function Entrar(event) {
        // Previne o envio do formulário
        event.preventDefault();
        
        // Captura os valores dos campos
        const login = loginInput.value.trim();
        const senha = senhaInput.value.trim();
        
        // Validação simples para campos vazios
        if (login === "" || senha === "") {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        // Envia os dados para o back-end via API
        fetch('/auth/login', {  // Altere para a URL correta do seu back-end
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, senha })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Credenciais inválidas');
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                // Sucesso - armazena o token (por exemplo, no localStorage ou sessionStorage)
                localStorage.setItem('authToken', data.token);

                // Redireciona para a página principal após login bem-sucedido
                window.location.href = '/home';  // Altere para o seu endereço de página de destino
            } else {
                alert("Login ou senha incorretos.");
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert("Ocorreu um erro ao tentar fazer o login. Tente novamente.");
        });
    }

    // Vincula o evento de clicar no botão "Entrar"
    document.getElementById('login').addEventListener('click', Entrar);
});
