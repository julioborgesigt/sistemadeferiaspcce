const readlineSync = require('readline-sync');
const fs = require('fs');

// Função para coletar informações dos funcionários e gerar arquivo de texto
function organizarFerias() {
    const funcionarios = [];

    // Pergunta sobre cada funcionário
    while (true) {
        const funcionario = {};
        funcionario.nome = readlineSync.question('Qual é o seu nome? ');
        funcionario.filho = readlineSync.keyInYNStrict('Você tem filhos em idade escolar? ');
        funcionario.idade = parseInt(readlineSync.question('Qual é a sua idade em dias? '));
        funcionario.antiguidade = parseInt(readlineSync.question('Quantos dias faz desde que você entrou na empresa? '));
        funcionario.ferias = readlineSync.question('Qual é a data das suas férias? (AAAA-MM-DD) ');

        funcionarios.push(funcionario);

        if (!readlineSync.keyInYNStrict('Deseja adicionar outro funcionário? ')) {
            break;
        }
    }

    // Gera o conteúdo do arquivo de texto
    let content = '';
    funcionarios.forEach(funcionario => {
        content += `Nome: ${funcionario.nome}\n`;
        content += `Filho em idade escolar: ${funcionario.filho ? 'Sim' : 'Não'}\n`;
        content += `Idade em dias: ${funcionario.idade}\n`;
        content += `Antiguidade na empresa em dias: ${funcionario.antiguidade}\n`;
        content += `Data das férias: ${funcionario.ferias}\n\n`;
    });

    // Salva o conteúdo no arquivo de texto
    fs.writeFileSync('ferias_funcionarios.txt', content);

    console.log('Arquivo de texto gerado com sucesso: ferias_funcionarios.txt');
}

// Executa a função principal
organizarFerias();
