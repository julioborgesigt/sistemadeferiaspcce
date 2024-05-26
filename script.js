
document.getElementById('toggle-dark-mode').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
});


document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#dataIngresso, #paquisitivoinicio, #paquisitivofim, #dataNascimento, #periodo11, #periodo12, #periodo21, #periodo22, #periodo31, #periodo32", {
        dateFormat: "d/m/Y", // Define o formato da data como DD/MM/AAAA
        altInput: true,     // Cria um input alternativo para exibir a data de forma amigável
        altFormat: "d/m/Y", // Define o formato alternativo da data
        allowInput: true,    // Permite que o usuário insira a data manualmente
        locale: "pt"
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const period1Checkbox = document.getElementById('periodo1');
    const period2Checkbox = document.getElementById('periodo2');
    const period3Checkbox = document.getElementById('periodo3');

    const period1Container = document.getElementById('periodo1-container');
    const period2Container = document.getElementById('periodo2-container');
    const period3Container = document.getElementById('periodo3-container');

    function updatePeriodVisibility() {
        period1Container.style.display = (period1Checkbox.checked || period2Checkbox.checked || period3Checkbox.checked) ? 'block' : 'none';
        period2Container.style.display = (period2Checkbox.checked || period3Checkbox.checked) ? 'block' : 'none';
        period3Container.style.display = period3Checkbox.checked ? 'block' : 'none';
    }

    function handleCheckboxChange() {
        if (this.checked) {
            if (this === period1Checkbox) {
                period2Checkbox.checked = false;
                period3Checkbox.checked = false;
            } else if (this === period2Checkbox) {
                period1Checkbox.checked = true;
                period3Checkbox.checked = false;
            } else if (this === period3Checkbox) {
                period1Checkbox.checked = true;
                period2Checkbox.checked = true;
            }
        } else {
            period1Checkbox.checked = false;
            period2Checkbox.checked = false;
            period3Checkbox.checked = false;
        }
        updatePeriodVisibility();
    }

    period1Checkbox.addEventListener('change', handleCheckboxChange);
    period2Checkbox.addEventListener('change', handleCheckboxChange);
    period3Checkbox.addEventListener('change', handleCheckboxChange);

    updatePeriodVisibility();
});




// Simula uma base de dados
let database = {};
const baseUrl = window.location.origin;

document.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            const matricula = params.get('matricula');
            if (matricula) {
                document.getElementById('matriculaCadastro').value = matricula;
               
            }
        });

     

// Função para verificar se uma data é um fim de semana
function verificarFimDeSemana(data) {
    const diaSemana = data.getDay();
    console.log("data apontadaaaaaa");
    console.log(data);
    // 0 = Domingo, 6 = Sábado
    return diaSemana === 0 || diaSemana === 6;
}


// Função para verificar conflitos de datas por cargo
function verificarConflitoPorCargo(cargo, conflitoCountIPC, conflitoCountEPC, conflitoCountIPCplantao, conflitoCountEPCplantao) {
    switch (cargo) {
        case 'IPC':
            return conflitoCountIPC >= 2; // Conflito se houver 2 ou mais IPC expediente
        case 'IPC':
            return conflitoCountIPC >= 1 && conflitoCountIPCplantao >= 1; // Conflito se houver 1 ou mais IPC expediente e 1 ou mais IPC plantão
        case 'EPC':
            return conflitoCountEPC >= 1; // Conflito se houver 1 ou mais EPC expediente
        case 'IPCplantao':
            return conflitoCountIPCplantao >= 1; // Conflito se houver 1 ou mais IPC plantão
        case 'IPCplantao':
            return conflitoCountIPC >= 2; // Conflito se houver 2 ou mais IPC do expediente
        case 'EPCplantao':
            return conflitoCountEPCplantao >= 1; // Conflito se houver 1 ou mais EPC plantão
        default:
            return false; // Nenhum conflito para outros cargos
    }
}

// Função para verificar conflitos de datas
function verificarConflito(dataInicio, dataFim, cargo) {
    let conflitoCountIPC = 0;
    let conflitoCountEPC = 0;
    let conflitoCountIPCplantao = 0;
    let conflitoCountEPCplantao = 0;

    for (let matricula in database) {
        let funcionario = database[matricula];
        let periodos = [
            { inicio: funcionario.periodo11, fim: funcionario.periodo12 },
            { inicio: funcionario.periodo21, fim: funcionario.periodo22 },
            { inicio: funcionario.periodo31, fim: funcionario.periodo32 }
        ];

        for (let periodo of periodos) {
            if (periodo.inicio && periodo.fim) {
                let inicioExistente = new Date(periodo.inicio.split('/').reverse().join('-'));
                let fimExistente = new Date(periodo.fim.split('/').reverse().join('-'));

                if ((dataInicio <= fimExistente && dataInicio >= inicioExistente) ||
                    (dataFim <= fimExistente && dataFim >= inicioExistente) ||
                    (dataInicio <= inicioExistente && dataFim >= fimExistente)) {
                    if (funcionario.cargo === 'IPC') {
                        conflitoCountIPC++;
                    } else if (funcionario.cargo === 'EPC') {
                        conflitoCountEPC++;
                    } else if (funcionario.cargo === 'IPCplantao') {
                        conflitoCountIPCplantao++;
                    } else if (funcionario.cargo === 'EPCplantao') {
                        conflitoCountEPCplantao++;
                    }
                }
            }
        }
    }

    // Verifica os limites de conflitos para cada cargo
    const conflito = verificarConflitoPorCargo(cargo, conflitoCountIPC, conflitoCountEPC, conflitoCountIPCplantao, conflitoCountEPCplantao);

    console.log("retornou " + conflito + " veja abaixo os contadores");
    console.log(conflitoCountEPC);
    console.log(conflitoCountIPC);
    console.log(conflitoCountEPCplantao);
    console.log(conflitoCountIPCplantao);

    return conflito;
}



function validarMatricula(input) {
    const anoCorrente = new Date().getFullYear();
    const matricula = input.value.trim();

    // Verifica se a matrícula já contém um ponto seguido de quatro dígitos no final
    if (!matricula.match(/\.\d{4}$/)) {
        input.value = `${matricula}.${anoCorrente}`;
    }
}

function preCadastro() {
    const matricula = document.getElementById("matriculaCadastro").value;
    const nome = document.getElementById("matriculaNome").value;
    const dataIngresso = document.getElementById("dataIngresso").value;
    const paquisitivoinicio = document.getElementById("paquisitivoinicio").value;
    const paquisitivofim = document.getElementById("paquisitivofim").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    
    
    

    // Salvar os dados no banco de dados
    let senha = '';
    if (matricula in database) {
        // Se a matrícula já existir, adicione os dados aos existentes
        Object.assign(database[matricula], {
            matricula: matricula,
            nome: nome,
            idade: calcularIdade(dataNascimento),
            paquisitivoinicio: paquisitivoinicio,
            paquisitivofim: paquisitivofim,
            antiguidade: calcularAntiguidade(dataIngresso),
            senha: senha
            
        });
        alert("Pre Cadastro concluído com suscesso");
    } else {
        // Se a matrícula não existir, crie um novo registro
        database[matricula] = {
            matricula: matricula,
            nome: nome,
            idade: calcularIdade(dataNascimento),
            paquisitivoinicio: paquisitivoinicio,
            paquisitivofim: paquisitivofim,
            antiguidade: calcularAntiguidade(dataIngresso),
            senha: senha
        };
        alert("Pre Cadastro concluído com suscesso 2");
    }

    salvarBancoDados(); // Salvar o banco de dados após calcular a pontuação
}

function cadastroInicial() {
    const matricula = document.getElementById("matriculaCadastro").value;
    const seraferiasEscolar = document.getElementById("seraferiasEscolar").checked ? 1 : 0;

    const qtdperiodos = document.querySelectorAll('input[name="qtdperiodos"]:checked').length;

    const qtdfilhosmenores = document.getElementById("qtdfilhosmenores").value;

    let periodo11 = document.getElementById("periodo11").value;
    let periodo12 = document.getElementById("periodo12").value;
    let periodo21 = document.getElementById("periodo21").value;
    let periodo22 = document.getElementById("periodo22").value;
    let periodo31 = document.getElementById("periodo31").value;
    let periodo32 = document.getElementById("periodo32").value;

    // Suas validações e lógica de cadastro aqui
    console.log("Matrícula:", matricula);
    console.log("Será férias escolar:", seraferiasEscolar);
    console.log("Quantidade de períodos:", qtdperiodos);
    console.log("Filhos menores em idade escolar:", qtdfilhosmenores);
    console.log("Período 1:", periodo11, "a", periodo12);
    console.log("Período 2:", periodo21, "a", periodo22);
    console.log("Período 3:", periodo31, "a", periodo32);


    



   // Converte as datas para objetos Date
   let dataInicio1 = new Date(periodo11.split('/').reverse().join('-') + 'T00:00:00');
   let dataFim1 = new Date(periodo12.split('/').reverse().join('-') + 'T00:00:00');
   let dataInicio2 = periodo21 ? new Date(periodo21.split('/').reverse().join('-') + 'T00:00:00') : null;
   let dataFim2 = periodo22 ? new Date(periodo22.split('/').reverse().join('-') + 'T00:00:00') : null;
   let dataInicio3 = periodo31 ? new Date(periodo31.split('/').reverse().join('-') + 'T00:00:00') : null;
   let dataFim3 = periodo32 ? new Date(periodo32.split('/').reverse().join('-') + 'T00:00:00') : null;


    // Verifica se as datas de início caem em um fim de semana
    if (verificarFimDeSemana(dataInicio1) || 
        (dataInicio2 && verificarFimDeSemana(dataInicio2)) || 
        (dataInicio3 && verificarFimDeSemana(dataInicio3))) {
        alert("Os períodos de férias escolhidos não podem começar em um fim de semana.");
        return;
    }

    let cargo = database[matricula].cargo;

    // Verifica conflitos para cada período
    if (verificarConflito(dataInicio1, dataFim1, cargo) || (dataInicio2 && verificarConflito(dataInicio2, dataFim2, cargo)) || (dataInicio3 && verificarConflito(dataInicio3, dataFim3, cargo))) {
        alert("Os períodos de férias escolhidos se sobrepõem a períodos já selecionados por outros funcionários.");
        return;
    }

    // Calcule a diferença em milissegundos entre as datas
    let diferenca1 = Math.abs(dataFim1 - dataInicio1);
    let diferenca2 = dataInicio2 ? Math.abs(dataFim2 - dataInicio2) : null;
    let diferenca3 = dataInicio3 ? Math.abs(dataFim3 - dataInicio3) : null;

    // Converta a diferença para dias
    let diferencaEmDias1 = diferenca1 ? diferenca1/ (1000 * 60 * 60 * 24) : null;
    let diferencaEmDias2 = diferenca2 ? diferenca2 / (1000 * 60 * 60 * 24) : null;
    let diferencaEmDias3 = diferenca3 ? diferenca3 / (1000 * 60 * 60 * 24) : null;

    console.log('a diferença em  dias 1 é:');
    console.log(diferencaEmDias1);
    
    console.log('a diferença em  dias 2 é:');
    console.log(diferencaEmDias2);
    
    console.log('a diferença em  dias 3 é:');
    console.log(diferencaEmDias3);

    if ( diferencaEmDias1 !== 29 && qtdperiodos == 1 ) {
        alert("O intervalo entre as datas de início e fim do período 1 de férias deve ser de 10 ou 15 ou 30 dias.");
        return;
    }
    if (qtdperiodos === 2 && diferencaEmDias2 === null  && (diferencaEmDias2 !== 14 || diferencaEmDias1 !== 14)  && qtdperiodos < 3 ) {
        alert("O intervalo entre as datas de início e fim do período 1 e 2 de férias deve ser de 10 ou 15 ou 30 dias.");
        return;
    }
    if (qtdperiodos === 3 && (diferencaEmDias3 === null || diferencaEmDias2 === null || diferencaEmDias1 === null || diferencaEmDias1 === NaN)  && (diferencaEmDias3 !== 9 || diferencaEmDias2 !== 9 || diferencaEmDias1 !== 9)) {
        alert("O intervalo entre as datas de início e fim do período 1, 2 e 3 de férias deve ser de 10 ou 15 ou 30 dias.");
        return;
    }

    paquisitivofim = database[matricula].paquisitivofim;

    let dataFimAquisitivo = new Date(paquisitivofim.split('/').reverse().join('-'));

    if (dataInicio1 <= dataFimAquisitivo) {
        alert("A data de início do período 1 de férias deve ser posterior à data final do período aquisitivo.");
        return;
    }

    if (dataInicio2 && dataInicio2 <= dataFim1) {
        alert("A data de início do período 2 de férias deve ser posterior à data final do período 1.");
        return;
    }

    if (dataInicio3 && dataInicio3 <= dataFim2) {
        alert("A data de início do período 3 de férias deve ser posterior à data final do período 2.");
        return;
    }

    
    

    // Salvar os dados no banco de dados
    if (matricula in database) {
        // Se a matrícula já existir, adicione os dados aos existentes
        Object.assign(database[matricula], {
            numeroDePeriodos: qtdperiodos,
            feriasescolarounao: seraferiasEscolar,
            
            qtdfilhosmenores: qtdfilhosmenores,
            periodo11: periodo11,
            periodo12: periodo12,
            periodo21: periodo21,
            periodo22: periodo22,
            periodo31: periodo31,
            periodo32: periodo32,
            
        });
    } else {
        // Se a matrícula não existir, crie um novo registro
        database[matricula] = {
            matricula: matricula,
            numeroDePeriodos: qtdperiodos,
            feriasescolarounao: seraferiasEscolar,
            
            qtdfilhosmenores: qtdfilhosmenores,
            periodo11: periodo11,
            periodo12: periodo12,
            periodo21: periodo21,
            periodo22: periodo22,
            periodo31: periodo31,
            periodo32: periodo32,
            
        };
    }

    if (seraferiasEscolar === 1) {
        feriasEscolar(matricula, qtdperiodos);
    } else {
        feriasNaoEscolar(matricula, qtdperiodos);
    }
}



let alertaExibido = false;

function validarMatricula(input) {
    if (input.value.length < 8 && !alertaExibido) {
        alertaExibido = true;
        alert("A matrícula deve ter pelo menos 8 caracteres.");
        input.focus();
    } else {
        alertaExibido = false;
    }
}

function finalizarCadastro() {
    document.getElementById("matriculaCadastro").value = "";
    document.getElementById("dataIngresso").value = "";
    document.getElementById("paquisitivoinicio").value = "";
    document.getElementById("paquisitivofim").value = "";
    document.getElementById("seraferiasEscolar").checked = false;
    document.getElementById("qtdperiodos").value = "";
    document.getElementById("dataNascimento").value = "";
    document.getElementById("qtdfilhosmenores").value = "";
    document.getElementById("periodo11").value = "";
    document.getElementById("periodo12").value = "";
    document.getElementById("periodo21").value = "";
    document.getElementById("periodo22").value = "";
    document.getElementById("periodo31").value = "";
    document.getElementById("periodo32").value = "";
}

function calcularAntiguidade(dataIngresso) {
    const dataAtual = new Date();
    const [dia, mes, ano] = dataIngresso.split('/');
    const dataIngressoFormatada = new Date(`${ano}-${mes}-${dia}`);
    const diferencaAnos = dataAtual.getFullYear() - dataIngressoFormatada.getFullYear();

    if (dataAtual.getMonth() < dataIngressoFormatada.getMonth() ||
        (dataAtual.getMonth() === dataIngressoFormatada.getMonth() && dataAtual.getDate() < dataIngressoFormatada.getDate())) {
        return diferencaAnos - 1;
    }

    return diferencaAnos;
}

function calcularIdade(dataNascimento) {
    const dataAtual = new Date();
    const [dia, mes, ano] = dataNascimento.split('/');
    const dataNascimentoFormatada = new Date(`${ano}-${mes}-${dia}`);
    const diferencaAnos = dataAtual.getFullYear() - dataNascimentoFormatada.getFullYear();

    if (dataAtual.getMonth() < dataNascimentoFormatada.getMonth() ||
        (dataAtual.getMonth() === dataNascimentoFormatada.getMonth() && dataAtual.getDate() < dataNascimentoFormatada.getDate())) {
        return diferencaAnos - 1;
    }

    return diferencaAnos;
}

function feriasEscolar(matricula, numeroDePeriodos) {

     // Cria um formulário para a opção de possuir filho em idade escolar
     let formulario = `
        <form id="formFeriasEscolar">
            <label for="possuiFilho">Possui filho em idade escolar?</label><br>
            <input type="radio" id="sim" name="possuiFilho" value="sim">
            <label for="sim">Sim</label><br>
            <input type="radio" id="nao" name="possuiFilho" value="nao">
            <label for="nao">Não</label><br>
            
        </form>
    `;

    let formulario2 = `
        <form id="formFeriasEscolar">
            <label for="ecasadoComPofessor">É casado com professor?</label><br>
            <input type="radio" id="sim" name="ecasadoComPofessor" value="sim">
            <label for="sim">Sim</label><br>
            <input type="radio" id="nao" name="ecasadoComPofessor" value="nao">
            <label for="nao">Não</label><br>
            
        </form>
    `;

    let formulario3 = `
        <form id="formFeriasEscolar">
            <label for="estudanteOUaluno">É estudante ou aluno de Curso de formação?</label><br>
            <input type="radio" id="sim" name="estudanteOUaluno" value="sim">
            <label for="sim">Sim</label><br>
            <input type="radio" id="nao" name="estudanteOUaluno" value="nao">
            <label for="nao">Não</label><br>
            <button type="button" onclick="calcularPontuacaoFeriasEscolar('${matricula}')">Finalizar cadastro</button>
            <button type="button" onclick="finalizarCadastro()">Limpar Informações</button>

        </form>
    `;
    
    // Adiciona o formulário à div "dados"
    document.getElementById("dados").innerHTML = formulario + formulario2 + formulario3;
    console.log(`Funcionário ${matricula} escolheu férias escolares em ${numeroDePeriodos} período(s).`);
}


function calcularPontuacaoFeriasEscolar(matricula, numeroDePeriodos) {
    // Obtém o valor selecionado pelo usuário
    let possuiFilho = document.querySelector('input[name="possuiFilho"]:checked').value;
    let ecasadoComPofessor = document.querySelector('input[name="ecasadoComPofessor"]:checked').value;
    let estudanteOUaluno = document.querySelector('input[name="estudanteOUaluno"]:checked').value;

    // Calcula a pontuação com base na resposta do usuário
    let pontuacaoferiasescolar = 0;
    if (possuiFilho === "sim") {
        pontuacaoferiasescolar += 5;
    }

    if (ecasadoComPofessor === "sim") {
        pontuacaoferiasescolar += 2;
    }

    if (estudanteOUaluno === "sim") {
        pontuacaoferiasescolar += 1;
    }

    database[matricula].pontuacaoferiasescolar = pontuacaoferiasescolar;
    
    salvarBancoDados(); // Salvar o banco de dados após calcular a pontuação
   
    alert("Cadastro concluído.");
    console.log(database[matricula]);
    // Redireciona para a página de conclusão do cadastro
    window.location.href = `conclusao.html?matricula=${matricula}`;
           
}




function feriasNaoEscolar(matricula, numeroDePeriodos) {
     // Cria um formulário para a opção de possuir filho em idade escolar
     let formulario4 = `
        <form id="formFeriasNaoEscolar">
            <label for="DoisEmpregos">Possui um segundo emprego com férias programas para o mesmo periodo?</label><br>
            <input type="radio" id="sim" name="DoisEmpregos" value="sim">
            <label for="sim">Sim</label><br>
            <input type="radio" id="nao" name="DoisEmpregos" value="nao">
            <label for="nao">Não</label><br>
            
        </form>
    `;

    let formulario5 = `
        <form id="formFeriasNaoEscolar">
            <label for="ConjugeMesmoPeriodo">Possui conjuge com o mesmo periodo de férias desejado?</label><br>
            <input type="radio" id="sim" name="ConjugeMesmoPeriodo" value="sim">
            <label for="sim">Sim</label><br>
            <input type="radio" id="nao" name="ConjugeMesmoPeriodo" value="nao">
            <label for="nao">Não</label><br>
            
        </form>
    `;

    let formulario6 = `
        <form id="formFeriasNaoEscolar">
            <label for="estudante">Você é estudante?</label><br>
            <input type="radio" id="sim" name="estudante" value="sim">
            <label for="sim">Sim</label><br>
            <input type="radio" id="nao" name="estudante" value="nao">
            <label for="nao">Não</label><br>
            <button type="button" onclick="calcularPontuacaoFeriasNaoEscolar('${matricula}')">Finalizar cadastro</button>
            <button type="button" onclick="finalizarCadastro()">Limpar Informações</button>
        </form>
    `;
    
    // Adiciona o formulário à div "dados"
    document.getElementById("dados").innerHTML = formulario4 + formulario5 + formulario6;
    console.log(database[matricula]);
    console.log(`Funcionário ${matricula} escolheu férias não escolares em ${numeroDePeriodos} período(s).`);
}


function calcularPontuacaoFeriasNaoEscolar(matricula) {
    // Obtém o valor selecionado pelo usuário
    let DoisEmpregos = document.querySelector('input[name="DoisEmpregos"]:checked').value;
    let ConjugeMesmoPeriodo = document.querySelector('input[name="ConjugeMesmoPeriodo"]:checked').value;
    let estudante = document.querySelector('input[name="estudante"]:checked').value;

    // Calcula a pontuação com base na resposta do usuário
    let pontuacaoferiasNaoescolar = 0;
    if (DoisEmpregos === "sim") {
        pontuacaoferiasNaoescolar += 5;
    }

    if (ConjugeMesmoPeriodo === "sim") {
        pontuacaoferiasNaoescolar += 2;
    }

    if (estudante === "sim") {
        pontuacaoferiasNaoescolar += 1;
    }
    console.log(pontuacaoferiasNaoescolar);
    

    database[matricula].pontuacaoferiasNaoescolar = pontuacaoferiasNaoescolar;
    
    salvarBancoDados(); // Salvar o banco de dados após calcular a pontuação
  
     alert("Cadastro concluído.");
    console.log(database[matricula]);
    // Redireciona para a página de conclusão do cadastro
    window.location.href = `conclusao.html?matricula=${matricula}`;
           
}


// Consulta pelo número da matricula
function exibirDados() {
    let matricula = document.getElementById("matriculaConsulta").value;
    let dados = database[matricula];
    if (dados) {
        let html = `<table border="1">
            <tr><th>Matrícula</th><td>${dados.matricula}</td></tr>
            <tr><th>Qtd Períodos</th><td>${dados.numeroDePeriodos}</td></tr>
            <tr><th>Férias Escolar</th><td >${dados.feriasescolarounao}</td></tr>
            <tr><th>Pontuação Férias Escolar</th><td >${dados.pontuacaoferiasescolar || 'não'}</td></tr>
            <tr><th>Pontuação Férias Nao Escolar(desempate)</th><td >${dados.pontuacaoferiasNaoescolar || 'não'}</td></tr>
            <tr><th>Idade</th><td >${dados.idade}</td></tr>`;
            
        // Verificar se os períodos de férias estão definidos
        if (dados.periodo11) {
            html += `<tr><th>Intenção de Férias P1 (Início)</th><td >${dados.periodo11}</td></tr>`;
            html += `<tr><th>Intenção de Férias P1 (Fim)</th><td >${dados.periodo12}</td></tr>`;
        }
        if (dados.periodo21) {
            html += `<tr><th>Intenção de Férias P2 (Início)</th><td >${dados.periodo21}</td></tr>`;
            html += `<tr><th>Intenção de Férias P2 (Fim)</th><td>${dados.periodo22}</td></tr>`;
        }
        if (dados.periodo31) {
            html += `<tr><th>Intenção de Férias P3 (Início)</th><td>${dados.periodo31}</td></tr>`;
            html += `<tr><th>Intenção de Férias P3 (Fim)</th><td >${dados.periodo32}</td></tr>`;
        }

        html += `</table>`;
        document.getElementById("dados2").innerHTML = html;
    } else {
        alert("Dados inexistentes.");
    }
}


// Exibe todos os cadastros
function exibirListaFinalFerias() {
    let html = "<h3>Lista de Férias com todos os cadastros</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Qtd Períodos</th><th>Idade</th><th>Qtd Filhos Menores</th><th>Antiguidade</th><th>Pontuação Férias Escolar</th><th>Pontuação Férias Não Escolar</th></tr>";
    
    // Converter o objeto em um array de objetos para poder ordenar
    let dataArray = Object.values(database);
    
    // Gerar a tabela HTML
    dataArray.forEach(dados => {
        html += `
            <tr>
                <td data-label="Matrícula">${dados.matricula}</td>
                <td data-label="Qtd Períodos">${dados.numeroDePeriodos}</td>
                <td data-label="Idade">${dados.idade}</td>
                <td data-label="Qtd Filhos Menores">${dados.qtdfilhosmenores}</td>
                <td data-label="Antiguidade">${dados.antiguidade}</td>
                <td data-label="Pontuação Férias Escolar">${dados.pontuacaoferiasescolar || 0}</td>
                <td data-label="Pontuação Férias Não Escolar">${dados.pontuacaoferiasNaoescolar || 0}</td>
            </tr>`;
    });
    
    html += "</table>";
    document.getElementById("dados2").innerHTML = html;
}



// Exibe os 6 cadastros selecionados para ferias escolar
function exibirListaFinalFeriasSelecionados() {
    let html = "<h3>Lista Final de Férias Escolar em ordem</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Qtd Períodos</th><th>Pontuação Férias Escolar</th><th>Idade(desempate)</th></tr>";
    
    // Converter o objeto em um array de objetos para poder ordenar
    let dataArray = Object.values(database);
    
    // Filtrar apenas os registros com pontuação de férias escolar maior que zero
    let selecionados = dataArray.filter(dados => dados.pontuacaoferiasescolar && dados.pontuacaoferiasescolar > 0);
    
    // Ordenar os registros filtrados
    selecionados.sort((a, b) => {
        if (b.pontuacaoferiasescolar !== a.pontuacaoferiasescolar) {
            return b.pontuacaoferiasescolar - a.pontuacaoferiasescolar;
        } else {
            return b.idade - a.idade;
        }
    });
    
    // Limitar a exibição aos 6 primeiros resultados
    let seisPrimeiros = selecionados.slice(0, 6);
    
    // Gerar a tabela HTML
    dataArray.forEach(dados => {
        html += `
            <tr>
                <td data-label="Matrícula">${dados.matricula}</td>
                <td data-label="Qtd Períodos">${dados.numeroDePeriodos}</td>
                <td data-label="Pontuação Férias Escolar">${dados.pontuacaoferiasescolar || 0}</td>
                <td data-label="Idade">${dados.idade}</td>
              
            </tr>`;
    });
/*
    seisPrimeiros.forEach(dados => {
        html += `<tr><td>${dados.matricula}</td><td>${dados.numeroDePeriodos}</td><td>${dados.pontuacaoferiasescolar || 0}</td><td>${dados.idade}</td></tr>`;
    });
    */
    html += "</table>";
    document.getElementById("dados2").innerHTML = html;
}




// Function to display vacations not chosen for school holiday
function exibirListaFinalFeriasNaoEscolar() {
    let html = "<h3>Lista Final de Férias Não Escolar em ordem de Preferências</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Qtd Períodos</th><th>Idade</th><th>Qtd Filhos Menores</th><th>Antiguidade</th><th>Pontuação Férias Nao Escolar(desempate)</th></tr>";
    
    // Converter o objeto em um array de objetos para poder ordenar
    let dataArray = Object.values(database);
    

    dataArray.sort((a, b) => {
        // Ordenar por pontuação de férias escolar em ordem decrescente
        if (b.idade !== a.idade) {
            return b.idade - a.idade;
        } else if (b.qtdfilhosmenores !== a.qtdfilhosmenores) {
            // Em caso de empate na pontuação, ordenar por idade em ordem decrescente
            return b.qtdfilhosmenores - a.qtdfilhosmenores;
        } else if (b.antiguidade !== a.antiguidade) {
            // Em caso de empate na pontuação, ordenar por antiguidade em ordem decrescente
            return b.antiguidade - a.antiguidade;
            t
        } else if (b.pontuacaoferiasNaoescolar !== a.pontuacaoferiasNaoescolar) {
            // Em caso de empate na pontuação, ordenar por antiguidade em ordem decrescente
            return b.pontuacaoferiasNaoescolar - a.pontuacaoferiasNaoescolar;
        }
    });



    // Filtrar apenas os registros sem pontuação de férias escolar ou com pontuação zero
    let naoEscolhidos = dataArray.filter(dados => !dados.pontuacaoferiasescolar || dados.pontuacaoferiasescolar === 0);
    
    // Ordenar os registros filtrados por idade
    naoEscolhidos.sort((a, b) => {
        return b.idade - a.idade;
    });
    

    dataArray.forEach(dados => {
        html += `
            <tr>
                <td data-label="Matrícula">${dados.matricula}</td>
                <td data-label="Qtd Períodos">${dados.numeroDePeriodos}</td>
                <td data-label="Idade">${dados.idade}</td>
                <td data-label="Qtd Filhos Menores">${dados.qtdfilhosmenores}</td>
                <td data-label="Antiguidade">${dados.antiguidade}</td>
                <td data-label="Pontuação Férias Não Escolar">${dados.pontuacaoferiasNaoescolar || 0}</td>
                
            </tr>`;
    });

    // Gerar a tabela HTML
    /*naoEscolhidos.forEach(dados => {
        html += `<tr><td>${dados.matricula}</td><td>${dados.numeroDePeriodos}</td><td>${dados.idade}</td><td>${dados.qtdfilhosmenores}</td><td>${dados.antiguidade}</td><td>${dados.pontuacaoferiasNaoescolar || 0}</td></tr>`;
    });*/
    
    html += "</table>";
    document.getElementById("dados2").innerHTML = html;
}




function calcularIdade(dataNascimento) {
    let [dia, mes, ano] = dataNascimento.split('/').map(Number);
    let nascimento = new Date(ano, mes - 1, dia);
    let hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    if (hoje.getMonth() < nascimento.getMonth() || 
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

function calcularAntiguidade(dataIngresso) {
    let [dia, mes, ano] = dataIngresso.split('/').map(Number);
    let ingresso = new Date(ano, mes - 1, dia);
    let hoje = new Date();
    return Math.floor((hoje - ingresso) / (1000 * 60 * 60 * 24));
}




carregarBancoDados()

function carregarBancoDados() {
    // URL do arquivo remoto
    //const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    //const PORT = process.env.PORT || 3000;
    const url = `${baseUrl}/banco_dados.json`;

    // Faz uma requisição GET para obter o arquivo JSON
    fetch(url)
        .then(response => {
            // Verifica se a resposta da requisição foi bem-sucedida
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo.');
            }
            // Retorna o conteúdo do arquivo JSON como texto
            return response.text();
        })
        .then(jsonData => {
            // Converte o JSON de volta para o objeto database
            database = JSON.parse(jsonData);
            console.log("Banco de dados carregado:", database);
            // Aqui você pode chamar qualquer função necessária para inicializar sua aplicação com os dados carregados
        })
        .catch(error => {
            // Trata qualquer erro que ocorrer durante o carregamento do arquivo
            console.error('Erro:', error);
        });
}


function salvarBancoDados() {
    // URL para salvar os dados
    //const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    //const PORT = process.env.PORT || 3000;
    const url = `${baseUrl}/banco_dados.json`;

    // Realiza uma requisição POST para enviar os dados atualizados para o servidor
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(database),
    })
    .then(response => {
        // Verifica se a resposta da requisição foi bem-sucedida
        if (!response.ok) {
                        throw new Error('Erro ao salvar os dados.');
        }
        alert("Dados salvos com sucesso!");
    })
    .catch(error => {
        // Trata qualquer erro que ocorrer durante o salvamento dos dados
        console.error('Erro:', error);
    });
}


function logout() {
    // Remove authentication token
    localStorage.removeItem('isAuthenticated');
    // Redireciona para a página de login
    window.location.href = 'index.html';
}




// Função para gerar PDF
function gerarPDF() {
    const { jsPDF } = window.jspdf;

    html2canvas(document.querySelector("#dados2")).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("dados_cadastro.pdf");
    });
}


