// Função para exibir as informações do formulário na página HTML
function exibirInformacoes() {
    const matricula = document.getElementById('matricula').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const filhos = document.getElementById('filhos').value;

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
        <h2>Informações do Formulário</h2>
        <p>Matrícula: ${matricula}</p>
        <p>Data de Nascimento: ${dataNascimento}</p>
        <p>Tem filhos em idade escolar: ${filhos}</p>
    `;

    // Exibe o botão de confirmação
    document.getElementById('confirmar').style.display = 'inline';
}

// Função para salvar os dados no banco de dados (simulado com localStorage)
function salvarBancoDados() {
    const matricula = document.getElementById('matricula').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const filhos = document.getElementById('filhos').value;

    const novoFuncionario = {
        matricula: matricula,
        dataNascimento: dataNascimento,
        filhos: filhos
    };

    let bancoDados = [];

    // Verifica se já existe algum dado no localStorage
    const dadosExistente = localStorage.getItem('bancodados');

    if (dadosExistente) {
        bancoDados = JSON.parse(dadosExistente);
    }

    // Adiciona o novo funcionário aos dados existentes
    bancoDados.push(novoFuncionario);

    // Salva os dados atualizados no localStorage
    localStorage.setItem('bancodados', JSON.stringify(bancoDados));

    // Exibe todos os dados na página HTML
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML += `
        <h2>Dados no Banco de Dados</h2>
    `;

    bancoDados.forEach(funcionario => {
        resultadoDiv.innerHTML += `
            <p>Matrícula: ${funcionario.matricula}</p>
            <p>Data de Nascimento: ${funcionario.dataNascimento}</p>
            <p>Tem filhos em idade escolar: ${funcionario.filhos}</p>
            <hr>
        `;
    });

    // Oculta o botão de confirmação
    document.getElementById('confirmar').style.display = 'none';
}
