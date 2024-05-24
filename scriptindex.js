let database = {};
        
document.addEventListener('DOMContentLoaded', () => {
    carregarBancoDados();
});


// Verifica se a página foi carregada a partir do cache do navegador
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.href = 'index.html';
    }
});

function carregarBancoDados() {
    const url = 'banco_dados.json';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo.');
            }
            return response.text();
        })
        .then(jsonData => {
            database = JSON.parse(jsonData);
            console.log("Banco de dados carregado:", database);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

carregarBancoDados();

function salvarBancoDados() {
    const url = 'banco_dados.json';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(database),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar os dados.');
        }
        alert("Dados salvos com sucesso!");
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}


function generateToken() {
    return Math.random().toString(36).substr(2);
}

function login() {
const matricula = document.getElementById('loginMatricula').value;
const senha = document.getElementById('loginSenha').value;
const isAdmin = document.getElementById('adminCheckbox').checked;

console.log("Tentando login:", { matricula, senha, isAdmin });

if (database[matricula] && database[matricula].senha === senha) {
console.log("Credenciais verificadas no banco de dados.");

const token = generateToken();
const expirationTime = new Date().getTime() + 10 * 60 * 1000; // 10 minutos em milissegundos
const loginData = { token, expirationTime };

localStorage.setItem('loginToken', JSON.stringify(loginData));



if (isAdmin) {
    if (senha === '25081990') {
        alert("Bem-vindo, Administrador!");
        window.location.href = 'adm.html';
    } else {
        alert("Você não é um administrador.");
    }
} else {
    alert("Login bem-sucedido!");
    window.location.href = `cadastro.html?matricula=${matricula}`;
}
} else {
alert("Matrícula ou senha incorreta.");
}
}

document.addEventListener('DOMContentLoaded', function() {
const checkboxes = document.querySelectorAll('.cargo-checkbox');

checkboxes.forEach(checkbox => {
checkbox.addEventListener('change', function() {
    if (this.checked) {
        checkboxes.forEach(box => {
            if (box !== this) {
                box.checked = false;
            }
        });
    }
});
});
});



function cadastrar() {


const matricula = document.getElementById('cadastroMatricula').value;
const senha = document.getElementById('cadastroSenha').value;
const confirmacaoSenha = document.getElementById('cadastroConfirmacaoSenha').value;

if (senha.length < 8 || senha.length > 8 || matricula.length < 8 || matricula.length > 8) {
alert("Matrícula e senha devem ter exatamente 8 caracteres.");
return;
}

if (senha !== confirmacaoSenha) {
alert("As senhas não coincidem.");
return;
}

if (database[matricula] && database[matricula].senha.length === 8) {
alert("Matrícula já cadastrada com uma senha.");
return;
}

const cargoIpc = document.getElementById("cargoIpc").checked;
const cargoEpc = document.getElementById("cargoEpc").checked;

if (!cargoIpc && !cargoEpc) {
alert("Por favor, selecione pelo menos uma opção de cargo.");
return;
}

let cargo = "";
if (cargoIpc) cargo = "IPC";
if (cargoEpc) cargo = "EPC";

if (database[matricula]) {

 // Se a matrícula já existir, adicione os dados aos existentes
Object.assign(database[matricula], {

senha: senha,
cargo: cargo


});
console.log('pre cad');




} else {
// Se a matrícula não existir, crie um novo registro
database[matricula] = 
{   
    senha,
    matricula,
    cargo
 };

console.log('novo cad');


}


salvarBancoDados();
}