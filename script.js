document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#dataIngresso, #paquisitivoinicio, #paquisitivofim, #dataNascimento, #periodo11, #periodo12, #periodo21, #periodo22, #periodo31, #periodo32", {
        dateFormat: "d/m/Y",
        altInput: true,
        altFormat: "d/m/Y",
        allowInput: true,
        locale: "pt"
    });

    const params = new URLSearchParams(window.location.search);
    const matricula = params.get('matricula');
    if (matricula) {
        document.getElementById('matriculaCadastro').value = matricula;
    }
});

let database = {};
const baseUrl = window.location.origin;

function verificarConflito(dataInicio, dataFim) {
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
                    return true;
                }
            }
        }
    }
    return false;
}

function cadastroInicial() {
    const matricula = document.getElementById("matriculaCadastro").value;
    const dataIngresso = document.getElementById("dataIngresso").value;
    const paquisitivoinicio = document.getElementById("paquisitivoinicio").value;
    const paquisitivofim = document.getElementById("paquisitivofim").value;
    const seraferiasEscolar = document.getElementById("seraferiasEscolar").checked ? 1 : 0;
    const qtdperiodos = parseInt(document.getElementById("qtdperiodos").value, 10);
    const dataNascimento = document.getElementById("dataNascimento").value;
    const qtdfilhosmenores = document.getElementById("qtdfilhosmenores").value;

    let periodo11 = document.getElementById("periodo11").value;
    let periodo12 = document.getElementById("periodo12").value;
    let periodo21 = document.getElementById("periodo21").value;
    let periodo22 = document.getElementById("periodo22").value;
    let periodo31 = document.getElementById("periodo31").value;
    let periodo32 = document.getElementById("periodo32").value;

    let dataInicio1 = new Date(periodo11.split('/').reverse().join('-'));
    let dataFim1 = new Date(periodo12.split('/').reverse().join('-'));
    let dataInicio2 = periodo21 ? new Date(periodo21.split('/').reverse().join('-')) : null;
    let dataFim2 = periodo22 ? new Date(periodo22.split('/').reverse().join('-')) : null;
    let dataInicio3 = periodo31 ? new Date(periodo31.split('/').reverse().join('-')) : null;
    let dataFim3 = periodo32 ? new Date(periodo32.split('/').reverse().join('-')) : null;

    if (verificarConflito(dataInicio1, dataFim1) || (dataInicio2 && verificarConflito(dataInicio2, dataFim2)) || (dataInicio3 && verificarConflito(dataInicio3, dataFim3))) {
        alert("Os períodos de férias escolhidos se sobrepõem a períodos já selecionados por outros funcionários.");
        return;
    }

    let diferenca1 = Math.abs(dataFim1 - dataInicio1);
    let diferenca2 = dataInicio2 ? Math.abs(dataFim2 - dataInicio2) : null;
    let diferenca3 = dataInicio3 ? Math.abs(dataFim3 - dataInicio3) : null;

    let diferencaEmDias1 = diferenca1 / (1000 * 60 * 60 * 24);
    let diferencaEmDias2 = diferenca2 ? diferenca2 / (1000 * 60 * 60 * 24) : null;
    let diferencaEmDias3 = diferenca3 ? diferenca3 / (1000 * 60 * 60 * 24) : null;

    if (diferencaEmDias1 !== 29 && qtdperiodos == 1) {
        alert("O intervalo entre as datas de início e fim do período 1 de férias deve ser de 10 ou 15 ou 30 dias.");
        return;
    }
    if (qtdperiodos === 2 && diferencaEmDias2 !== null && (diferencaEmDias2 !== 14 || diferencaEmDias1 !== 14) && qtdperiodos < 3) {
        alert("O intervalo entre as datas de início e fim do período 1 e 2 de férias deve ser de 10 ou 15 ou 30 dias.");
        return;
    }
    if (qtdperiodos === 3 && (diferencaEmDias3 === null || diferencaEmDias2 === null || diferencaEmDias1 === null || isNaN(diferencaEmDias1)) && (diferencaEmDias3 !== 9 || diferencaEmDias2 !== 9 || diferencaEmDias1 !== 9)) {
        alert("O intervalo entre as datas de início e fim do período 1, 2 e 3 de férias deve ser de 10 ou 15 ou 30 dias.");
        return;
    }

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

    if (matricula in database) {
        Object.assign(database[matricula], {
            numeroDePeriodos: qtdperiodos,
            feriasescolarounao: seraferiasEscolar,
            idade: calcularIdade(dataNascimento),
            qtdfilhosmenores: qtdfilhosmenores,
            periodo11: periodo11,
            periodo12: periodo12,
            periodo21: periodo21,
            periodo22: periodo22,
            periodo31: periodo31,
            periodo32: periodo32,
            antiguidade: calcularAntiguidade(dataIngresso)
        });
    } else {
        database[matricula] = {
            matricula: matricula,
            numeroDePeriodos: qtdperiodos,
            feriasescolarounao: seraferiasEscolar,
            idade: calcularIdade(dataNascimento),
            qtdfilhosmenores: qtdfilhosmenores,
            periodo11: periodo11,
            periodo12: periodo12,
            periodo21: periodo21,
            periodo22: periodo22,
            periodo31: periodo31,
            periodo32: periodo32,
            antiguidade: calcularAntiguidade(dataIngresso)
        };
    }

    alert("Cadastro realizado com sucesso!");
}

function calcularAntiguidade(dataIngresso) {
    const hoje = new Date();
    const [dia, mes, ano] = dataIngresso.split('/');
    const dataIngressoFormatada = new Date(`${ano}-${mes}-${dia}`);
    const diferencaEmMs = hoje - dataIngressoFormatada;
    const diferencaEmAnos = diferencaEmMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(diferencaEmAnos);
}

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const [dia, mes, ano] = dataNascimento.split('/');
    const dataNascimentoFormatada = new Date(`${ano}-${mes}-${dia}`);
    const diferencaEmMs = hoje - dataNascimentoFormatada;
    const diferencaEmAnos = diferencaEmMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(diferencaEmAnos);
}
