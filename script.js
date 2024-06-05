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



// Função para verificar conflitos de datas
function verificarConflito(dataInicio, dataFim, cargo) {
    let conflitoCountIPC = 0;
    let conflitoCountEPC = 0;
    let conflitoCountIPCplantao = 0;
    let conflitoCountEPCplantao = 0;



     // Subtrair um dia da data
     dataInicio.setDate(dataInicio.getDate() + 1);

     // Formatar a data de volta para DD/MM/AAAA
     let diaAnterior = ("0" + dataInicio.getDate()).slice(-2);
     let mesAnterior = ("0" + (dataInicio.getMonth() + 1)).slice(-2);
     let anoAnterior = dataInicio.getFullYear();
 
     let dataAnterior = `${diaAnterior}/${mesAnterior}/${anoAnterior}`;
     console.log(dataAnterior);  // Resultado

     
     
         dataFim.setDate(dataFim.getDate() - 1);
     
         // Formatar a data de volta para DD/MM/AAAA
         let diaPosterior = ("0" + dataFim.getDate()).slice(-2);
         let mesPosterior = ("0" + (dataFim.getMonth() + 1)).slice(-2);
         let anoPosterior = dataFim.getFullYear();
     
         let dataPosterior = `${diaPosterior}/${mesPosterior}/${anoPosterior}`;
         console.log(dataPosterior);  // Resultado
    



    for (let matricula in database) {
        let funcionario = database[matricula];
        let periodos = [
            { inicio: funcionario.periodo11, fim: funcionario.periodo12 },
            { inicio: funcionario.periodo21, fim: funcionario.periodo22 },
            { inicio: funcionario.periodo31, fim: funcionario.periodo32 }
        ];


        console.log("data data Inicio", dataInicio);
        console.log("data Fim", dataFim);
        console.log("data anterior", dataAnterior);
        console.log("data Posterior", dataPosterior);



        for (let periodo of periodos) {
            if (periodo.inicio && periodo.fim) {
                let inicioExistente = new Date(periodo.inicio.split('/').reverse().join('-'));
                let fimExistente = new Date(periodo.fim.split('/').reverse().join('-'));
                 // Adicionar 5 dias de margem
               
                
                

                if ((dataAnterior   <= fimExistente && dataInicio  >= inicioExistente) ||
                    (dataFim  <= fimExistente && dataPosterior   >= inicioExistente)) {
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


// Função para conclusão do cadastro
function concluirCadastro() {
    const matricula = document.getElementById("matriculaCadastro").value;

    // Verificar a pontuação do usuário antes de permitir a conclusão do cadastro
    if (verificarPontuacaoUsuario(matricula)) {
        // Se a pontuação do usuário for a maior, permitir a conclusão do cadastro
        console.log("Cadastro concluído com sucesso!");
       
        salvarBancoDados(); // Salvar o banco de dados após a conclusão do cadastro
        
        window.location.href = `conclusao.html?matricula=${matricula}`;
        
    } else {
        alert("Tente novamente depois");
        carregarBancoDados();
        
    }
}


// Função para o botão de verificação de pontuação
function verificarPontuacao() {
    const matricula = document.getElementById("matriculaCadastro").value;
    let escolhaotipodeferias =  database[matricula].feriasescolarounao
    if(escolhaotipodeferias === 1 || escolhaotipodeferias === 0 ){
        const matricula = document.getElementById("matriculaCadastro").value;
        verificarPontuacaoUsuario(matricula, true);

    }else if(escolhaotipodeferias !== 1 && escolhaotipodeferias !== 0 ){
        alert("escolha primeiro para qual tipo de férias você deseja consultar")
        carregarBancoDados();
        
    } else{
        alert("escolha primeiro para qual tipo de férias você deseja consultar")
        carregarBancoDados();
        
    } 



    
}



function verificarPontuacaoUsuario(matricula, apenasVerificar = false) {
    const pontuacaoUsuario = database[matricula].pontuacaoferiasescolar || 0;
    const pontuacaoUsuarioNaoescolar = database[matricula].pontuacaoferiasNaoescolar || 0;
    const cargoUsuario = database[matricula].cargo;
    const tipodeferias = database[matricula].feriasescolarounao;
    let maiorPontuacao = 0;
    let matriculaMaiorPontuacao = '';
    let maiorPontuacaoNaoescolar = 0;
    let matriculaMaiorPontuacaoNaoescolar = '';
    let nomeMaiorPontuacaoescolar = '';
    let nomeMaiorPontuacaoNaoescolar = '';
    
    console.log("Este é o cargo em cadastramento", cargoUsuario);

    // Função para verificar a maior pontuação considerando os cargos equivalentes
    function verificarMaiorPontuacao(cargosEquivalentes,  apenasVerificar = false) {

        let maiorPontuacao = 0;
        let matriculaMaiorPontuacao = '';
        let nomeMaiorPontuacaoescolar = '';
        
        for (let key in database) {
            if (database[key].cadastrado === 0 && 
                cargosEquivalentes.includes(database[key].cargo) && 
                database[key].pontuacaoferiasescolar && 
                database[key].pontuacaoferiasescolar > maiorPontuacao) {
                
                maiorPontuacao = database[key].pontuacaoferiasescolar;
                matriculaMaiorPontuacao = key;
                nomeMaiorPontuacaoescolar = database[key].nome;
            }
        }
        if (apenasVerificar) {
            if (pontuacaoUsuario >= maiorPontuacao) {
                alert(`Você possui a maior pontuação escolar. ${pontuacaoUsuario} contra ${maiorPontuacao}`);
            } else {
                alert(`A maior pontuação escolar é da matrícula ${matriculaMaiorPontuacao} - Nome: ${nomeMaiorPontuacaoescolar} contra ${maiorPontuacao}.`);
            }
            return; // Não continuar com o cadastro
        }
    }


    
    // Função para verificar a maior pontuação considerando os cargos equivalentes e ferias não escolar
    function verificarMaiorPontuacaoNaoEscolar(cargosEquivalentes,  apenasVerificar = false) {
        let maiorPontuacaoNaoescolar = 0;
        let matriculaMaiorPontuacaoNaoescolar = '';
        let nomeMaiorPontuacaoNaoescolar = '';

        for (let key in database) {
            if (database[key].cadastrado === 0 && 
                cargosEquivalentes.includes(database[key].cargo) && 
                database[key].pontuacaoferiasNaoescolar && 
                database[key].pontuacaoferiasNaoescolar > maiorPontuacaoNaoescolar) {
                
                maiorPontuacaoNaoescolar = database[key].pontuacaoferiasNaoescolar;
                matriculaMaiorPontuacaoNaoescolar  = key;
                nomeMaiorPontuacaoNaoescolar  = database[key].nome;
            }
        }
        if (apenasVerificar) {
            if (pontuacaoUsuarioNaoescolar >= maiorPontuacaoNaoescolar) {
                alert(`Você possui a maior pontuação não escolar. ${pontuacaoUsuarioNaoescolar} contra ${maiorPontuacaoNaoescolar }`);
            } else {
                alert(`A maior pontuação não escolar é da matrícula ${matriculaMaiorPontuacaoNaoescolar } - Nome: ${nomeMaiorPontuacaoNaoescolar } contra ${maiorPontuacaoNaoescolar }.`);
            }
            return; // Não continuar com o cadastro
        }
    }

    if ((cargoUsuario === "EPC" || cargoUsuario === "EPCplantao") && tipodeferias === 1) {
        alert("Entrou na rotina EPC");
        verificarMaiorPontuacao(["EPC", "EPCplantao"], apenasVerificar);
    } else if ((cargoUsuario === "IPC" || cargoUsuario === "IPCplantao") && tipodeferias === 1) {
        alert("Entrou na rotina IPC");
        verificarMaiorPontuacao(["IPC", "IPCplantao"], apenasVerificar);
    }else if ((cargoUsuario === "EPC" || cargoUsuario === "EPCplantao") && tipodeferias === 0) {
        alert("Entrou na rotina EPC não escolar");
        verificarMaiorPontuacaoNaoEscolar(["EPC", "EPCplantao"], apenasVerificar);
    }else if ((cargoUsuario === "IPC" || cargoUsuario === "IPCplantao") && tipodeferias === 0 ) {
        alert("Entrou na rotina IPC não escolar");
        verificarMaiorPontuacaoNaoEscolar(["IPC", "IPCplantao"], apenasVerificar);
    }





    // Verificar se a pontuação do usuário é maior ou igual à maior pontuação encontrada
    if (pontuacaoUsuario < maiorPontuacao) {
        alert(`A pontuação de férias escolares do usuário não é a maior do banco de dados. A maior pontuação é da matrícula ${matriculaMaiorPontuacao} - Nome: ${nomeMaiorPontuacaoescolar}. Cadastro não permitido.`);
        return false; // Não permitir a conclusão do cadastro
    }

    // Verificar se a pontuação do usuário é maior ou igual à maior pontuação encontrada
    if (pontuacaoUsuarioNaoescolar < maiorPontuacaoNaoescolar) {
        alert(`A pontuação de férias escolares do usuário não é a maior do banco de dados. A maior pontuação é da matrícula ${matriculaMaiorPontuacao} - Nome: ${nomeMaiorPontuacaoNaoescolar}. Cadastro não permitido.`);
        return false; // Não permitir a conclusão do cadastro
    }

    return true; // Permitir a conclusão do cadastro
    
}


function preCadastro() {
    const matricula = document.getElementById("matriculaCadastro").value;
    const nome = document.getElementById("matriculaNome").value;
    const dataIngresso = document.getElementById("dataIngresso").value; //antiguidade
    const paquisitivoinicio = document.getElementById("paquisitivoinicio").value; 
    const paquisitivofim = document.getElementById("paquisitivofim").value;
    const dataNascimento = document.getElementById("dataNascimento").value; // idade
    const qtdfilhosmenores = document.getElementById("qtdfilhosmenores").value; // filhos em idade escolar
    const cargoIpc = document.getElementById("cargoIpc").checked;
    const cargoEpc = document.getElementById("cargoEpc").checked;
    const cargoIpcPlantao = document.getElementById("cargoIpcPlantao").checked;
    const cargoEpcPlantao = document.getElementById("cargoEpcPlantao").checked;

    if (!cargoIpc && !cargoEpc && !cargoEpcPlantao && !cargoIpcPlantao) {
        alert("Por favor, selecione pelo menos uma opção de cargo.");
        return;
    }

    let cargo = "";
    let cadastrado = 0;
    if (cargoIpc) cargo = "IPC";
    if (cargoEpc) cargo = "EPC";
    if (cargoIpcPlantao) cargo = "IPCplantao";
    if (cargoEpcPlantao) cargo = "EPCplantao";     

    // Salvar os dados no banco de dados
    let senha = '';
    if (matricula in database) {
        // Novo objeto com os dados
        let novosDados = {
            matricula: matricula,
            nome: nome,
            dataNascimento: dataNascimento,
            idadeDias: calcularIdadeDias(dataNascimento),
            idade: calcularIdadeAnos(dataNascimento),
            paquisitivoinicio: paquisitivoinicio,
            paquisitivofim: paquisitivofim,
            dataIngresso: dataIngresso,
            antiguidade: calcularAntiguidade(dataIngresso),
            qtdfilhosmenores: qtdfilhosmenores,
            senha: senha,
            cargo: cargo,
            cadastrado: cadastrado
        };
    
        // Remove propriedades com valores em branco
        Object.keys(novosDados).forEach(key => {
            if (novosDados[key] === "" || novosDados[key] === null || novosDados[key] === undefined) {
                delete novosDados[key];
            }
        });
    
        // Se a matrícula já existir, adicione os dados aos existentes
        Object.assign(database[matricula], novosDados);
        //alert("Pre Cadastro concluído com suscesso");
        alert("Pre Cadastro atualizado com suscesso!");
    } else {
        // Se a matrícula não existir, crie um novo registro
        database[matricula] = {
            matricula: matricula,
            nome: nome,
            dataNascimento: dataNascimento,
            idadeDias: calcularIdadeDias(dataNascimento),
            idade: calcularIdadeAnos(dataNascimento),
            paquisitivoinicio: paquisitivoinicio,
            paquisitivofim: paquisitivofim,
            dataIngresso: dataIngresso,
            antiguidade: calcularAntiguidade(dataIngresso),
            qtdfilhosmenores: qtdfilhosmenores,
            senha: senha,
            cargo: cargo,
            cadastrado: cadastrado
            
        };
        alert("Pre Cadastro concluído com suscesso!");
    }


    calcularPontuacaoFeriasEscolar(matricula);
    salvarBancoDados(); // Salvar o banco de dados após calcular a pontuação
   

}


function queroferiasescolar() {
    const matricula = document.getElementById("matriculaCadastro").value;
    let feriasescolarounao = 1;

    // Mostrar o indicador de carregamento
    document.getElementById("loading").style.display = "block";

    // Salvar os dados no banco de dados
    if (matricula in database) {
        // Se a matrícula já existir, adicione os dados aos existentes
        Object.assign(database[matricula], {
            feriasescolarounao: feriasescolarounao,
        });
    } else {
        // Se a matrícula não existir, crie um novo registro
        database[matricula] = {
            feriasescolarounao: feriasescolarounao,
        };
    }

    
    salvarBancoDados();

    // Usar setTimeout para adicionar um atraso antes de carregar o banco de dados
    setTimeout(() => {

        let html = `<table border="1">
        <hr> <tr>Você escolheu Férias escolar</tr><hr>`;

        html += `</table>`;
         document.getElementById("escolhadeferias").innerHTML = html;

        carregarBancoDados();
        
        // Ocultar o indicador de carregamento após o carregamento do banco de dados
        document.getElementById("loading").style.display = "none";
    }, 3000); // 3000 milissegundos = 3 segundos
}


function queroferiasnaoescolar() {
    const matricula = document.getElementById("matriculaCadastro").value;
    let feriasescolarounao = 0;

    // Mostrar o indicador de carregamento
    document.getElementById("loading").style.display = "block";

    // Salvar os dados no banco de dados
    if (matricula in database) {
        // Se a matrícula já existir, adicione os dados aos existentes
        Object.assign(database[matricula], {
            feriasescolarounao: feriasescolarounao,
        });
    } else {
        // Se a matrícula não existir, crie um novo registro
        database[matricula] = {
            feriasescolarounao: feriasescolarounao,
        };
    }

    
    salvarBancoDados();

    // Usar setTimeout para adicionar um atraso antes de carregar o banco de dados
    setTimeout(() => {

        let html = `<table border="1">
        <hr> <tr>Você escolheu Férias não escolar</tr><hr>`;

        html += `</table>`;
         document.getElementById("escolhadeferias").innerHTML = html;

        carregarBancoDados();
        
        // Ocultar o indicador de carregamento após o carregamento do banco de dados
        document.getElementById("loading").style.display = "none";
    }, 3000); // 3000 milissegundos = 3 segundos
}

/*
function queroferiasnaoescolar() {
    const matricula = document.getElementById("matriculaCadastro").value;
    let feriasescolarounao = 0;

    // Salvar os dados no banco de dados
    if (matricula in database) {
        // Se a matrícula já existir, adicione os dados aos existentes
        Object.assign(database[matricula], {
            
            feriasescolarounao: feriasescolarounao,
                        
        });
    } else {
        // Se a matrícula não existir, crie um novo registro
        database[matricula] = {
            
            feriasescolarounao: feriasescolarounao,
           
        };
    }
    salvarBancoDados();

     // Usar setTimeout para adicionar um atraso antes de carregar o banco de dados
     setTimeout(() => {

    let html = `<table border="1">
    <hr><tr>Você escolheu Férias não escolar</tr><hr>`;
        
    
        html += `</table>`;
        document.getElementById("escolhadeferias").innerHTML = html;
    
        carregarBancoDados();

    // Ocultar o indicador de carregamento após o carregamento do banco de dados
    document.getElementById("loading").style.display = "none";
    }, 3000); // 3000 milissegundos = 3 segundos
}
*/

function cadastroInicial() {
    
    



    const matricula = document.getElementById("matriculaCadastro").value;
    //const seraferiasEscolar = document.getElementById("seraferiasEscolar").checked ? 1 : 0;

    const qtdperiodos = document.querySelectorAll('input[name="qtdperiodos"]:checked').length;

    

    let periodo11 = document.getElementById("periodo11").value;
    let periodo12 = document.getElementById("periodo12").value;
    let periodo21 = document.getElementById("periodo21").value;
    let periodo22 = document.getElementById("periodo22").value;
    let periodo31 = document.getElementById("periodo31").value;
    let periodo32 = document.getElementById("periodo32").value;

    // Suas validações e lógica de cadastro aqui
    console.log("Matrícula:", matricula);
   // console.log("Será férias escolar:", seraferiasEscolar);
    console.log("Quantidade de períodos:", qtdperiodos);
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

    if ( diferencaEmDias1 !== 27 && qtdperiodos == 1 ) {
        alert("O intervalo entre as datas de início e fim do período 1 de férias deve ser de 10 ou 15 ou 30 dias.");
        return;
    }
    if (qtdperiodos === 2 && diferencaEmDias2 === null  && (diferencaEmDias2 !== 12 || diferencaEmDias1 !== 12)  && qtdperiodos < 3 ) {
        alert("O intervalo entre as datas de início e fim do período 1 e 2 de férias deve ser de 10 ou 15 ou 30 dias.");
        return;
    }
    if (qtdperiodos === 3 && (diferencaEmDias3 === null || diferencaEmDias2 === null || diferencaEmDias1 === null || diferencaEmDias1 === NaN)  && (diferencaEmDias3 !== 7 || diferencaEmDias2 !== 7 || diferencaEmDias1 !== 7)) {
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

    
    
    let cadastrado = 1;

    // Salvar os dados no banco de dados
    if (matricula in database) {
        // Se a matrícula já existir, adicione os dados aos existentes
        Object.assign(database[matricula], {
            numeroDePeriodos: qtdperiodos,
           
            
           
            periodo11: periodo11,
            periodo12: periodo12,
            periodo21: periodo21,
            periodo22: periodo22,
            periodo31: periodo31,
            periodo32: periodo32,
            cadastrado: cadastrado
            
        });
    } else {
        // Se a matrícula não existir, crie um novo registro
        database[matricula] = {
            matricula: matricula,
            numeroDePeriodos: qtdperiodos,
            
            
            
            periodo11: periodo11,
            periodo12: periodo12,
            periodo21: periodo21,
            periodo22: periodo22,
            periodo31: periodo31,
            periodo32: periodo32,
            cadastrado: cadastrado
        };
    }

    
    let escolhaotipodeferias =  database[matricula].feriasescolarounao
    alert(`este é seu tipo de ferias escolhido2" ${escolhaotipodeferias}`);

    if(escolhaotipodeferias === 1 || escolhaotipodeferias === 0 ){
        alert("concluiu o cadastro");
        concluirCadastro(); // Salvar o banco de dados

    }else{
        alert("verifique sua escolha de ferias");
        alert(escolhaotipodeferias);
        alert("escolha qual o tipo de férias você deseja cadastrar")
        carregarBancoDados();


        
        

    }  

    
   
        
    
}



let alertaExibido = false;

function validarMatricula(input) {
    if (input.value.length < 13 && !alertaExibido) {
        alertaExibido = true;
        alert("A matrícula deve ter pelo menos 13 caracteres.");
        input.focus();
    } else {
        alertaExibido = false;
    }
}


function calcularIdadeAnos(dataNascimento) {
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

function calcularIdadeDias(dataNascimento) {
    let [dia, mes, ano] = dataNascimento.split('/').map(Number);
    let nascimento = new Date(ano, mes - 1, dia);
    let hoje = new Date();
    let diferencaTempo = hoje - nascimento;
    let idadeDias = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));
    return idadeDias;
}



function calcularAntiguidade(dataIngresso) {
    let [dia, mes, ano] = dataIngresso.split('/').map(Number);
    let ingresso = new Date(ano, mes - 1, dia);
    let hoje = new Date();
    return Math.floor((hoje - ingresso) / (1000 * 60 * 60 * 24));
}



function calcularPontuacaoFeriasEscolar(matricula) {
    // Obtém o valor selecionado pelo usuário
    let possuiFilho = database[matricula].qtdfilhosmenores;
    
    let ecasadoComPofessor = document.querySelector('input[name="ecasadoComPofessor"]:checked').value;
    let estudanteOUaluno = document.querySelector('input[name="estudanteOUaluno"]:checked').value;
    

    // Calcula a pontuação com base na resposta do usuário
    let pontuacaoferiasescolar = 0;
    console.log("esta é a qtd de filhos menores");
    console.log(possuiFilho);


    if (possuiFilho !== 0) {
        pontuacaoferiasescolar += (possuiFilho * 8000);
    }

    if (ecasadoComPofessor === "1") {
        pontuacaoferiasescolar += 7000;
    }

    if (estudanteOUaluno === "1") {
        pontuacaoferiasescolar += 6000;
    }

    

    database[matricula].pontuacaoferiasescolar = parseFloat(pontuacaoferiasescolar.toFixed(2));
    database[matricula].possuiFilho = possuiFilho;
    database[matricula].ecasadoComPofessor = ecasadoComPofessor;
    database[matricula].estudanteOUaluno = estudanteOUaluno;
    
    salvarBancoDados(); // Salvar o banco de dados após calcular a pontuação
   
    //alert("Cadastro concluído.");
    calcularPontuacaoFeriasNaoEscolar(matricula)
   
}



function calcularPontuacaoFeriasNaoEscolar(matricula) {
    // Obtém o valor selecionado pelo usuário
    let DoisEmpregos = document.querySelector('input[name="DoisEmpregos"]:checked').value;
    let ConjugeMesmoPeriodo = document.querySelector('input[name="ConjugeMesmoPeriodo"]:checked').value;
    let estudante = document.querySelector('input[name="estudante"]:checked').value;
    let gestante = document.querySelector('input[name="gestante"]:checked').value;
    let possuiFilho = database[matricula].qtdfilhosmenores;
    let antiguidade = database[matricula].antiguidade;
    let idadeDias = database[matricula].idadeDias;


    // Calcula a pontuação com base na resposta do usuário
    let pontuacaoferiasNaoescolar = 0;

    if (gestante === "1") {
        pontuacaoferiasNaoescolar += 5000;
    }

    if (possuiFilho !== 0) {
        pontuacaoferiasNaoescolar += (possuiFilho * 500);
    }

    if (estudante === "1") {
        pontuacaoferiasNaoescolar += 237;
    }

    if (DoisEmpregos === "1") {
        pontuacaoferiasNaoescolar += 120; 
    }

    if (antiguidade !== "0") {
        pontuacaoferiasNaoescolar += ((antiguidade / 365) * 2); //minimo 20 maximo 1140 //minimo 2 maximo 114
    }

    if (ConjugeMesmoPeriodo === "1") {
        pontuacaoferiasNaoescolar += 1;
    }

    if (idadeDias !== "0") {
        pontuacaoferiasNaoescolar += (idadeDias / 100000); //minimo 1.8(6.570) maximo 7.5(27.375)  //minimo 0.18(0,0657) maximo 0.75(0,27375)
    }
    
    console.log(pontuacaoferiasNaoescolar);
    
    

    database[matricula].pontuacaoferiasNaoescolar = parseFloat(pontuacaoferiasNaoescolar.toFixed(2));
    database[matricula].pontuacaoferiasescolar = database[matricula].pontuacaoferiasescolar + parseFloat(pontuacaoferiasNaoescolar.toFixed(2)); 
    database[matricula].gestante = gestante;
    database[matricula].possuiFilho = possuiFilho;
    database[matricula].estudante = estudante;
    database[matricula].DoisEmpregos = DoisEmpregos;
    database[matricula].ConjugeMesmoPeriodo = ConjugeMesmoPeriodo;
 
    
    salvarBancoDados(); // Salvar o banco de dados após calcular a pontuação
  
    // alert("Cadastro concluído.");
    console.log(database[matricula]);
    // Redireciona para a página de conclusão do cadastro
    //window.location.href = `conclusao.html?matricula=${matricula}`;
           
}



// Consulta pelo número da matricula
function exibirDadosPorMatricula() {
    let matricula = document.getElementById("matriculaConsulta").value;
    let dados = database[matricula];
    if (dados) {
        let html = `<table border="1">
        <tr><th>Matrícula</th><td> ${dados.matricula}</td></tr>
        <tr><th>Matrícula</th><td> ${dados.nome}</td></tr>
        <tr><th>Cargo</th><td>${dados.cargo}</td></tr>

        <tr><th style="font-size: 20px; text-align: center;">Critéiros para férias escolar</th><td></td></tr>


        <tr><th>Qtd Filho em idade escolar</th><td>${dados.possuiFilho}</td></tr>
        <tr><th>Casado com prof.?</th><td>${dados.ecasadoComPofessor === "1" ? 'Sim' : 'Não'}</td></tr>
        <tr><th>Estudante ou aluno de ACADEPOL?</th><td>${dados.estudanteOUaluno === 1 ? 'Sim' : 'Não'}</td></tr>

        <tr><th style="font-size: 20px; text-align: center;">Critéiros para férias Não escolar</th><td></td></tr>

            
            <tr><th>Gestante?</th><td>${dados.gestante === 1 ? 'Sim' : 'Não'}</td></tr>
            <tr><th>Qtd de Filhos de idade escolar</th><td>${dados.qtdfilhosmenores}</td></tr>
            <tr><th>Estudante?</th><td>${dados.estudante === 1 ? 'Sim' : 'Não'}</td></tr>
            <tr><th>Dois vínculos com mesmo periodo</th><td>${dados.DoisEmpregos === 1 ? 'Sim' : 'Não'}</td></tr>
            <tr><th>Conj. com mesmo periodo</th><td>${dados.ConjugeMesmoPeriodo === 1 ? 'Sim' : 'Não'}</td></tr>
            <tr><th>Antiguidade</th><td>${dados.antiguidade}</td></tr>
            <tr><th>Idade</th><td>${dados.idade}</td></tr>`;
            
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
function exibirListaCompletaDEFerias() {
    let html = "<h3>Lista de Férias com todos os cadastros EPC e IPC</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Nome</th><th>Qtd Períodos</th><th>Idade</th><th>Qtd Filho Men.</th><th>Antiguidade</th><th>Pontuação Férias Escolar</th><th>Pontuação Férias Não Escolar</th></tr>";

    // Converter o objeto em um array de objetos para poder ordenar
    let anoCorrente = new Date().getFullYear().toString();
    // Converter o objeto em um array de objetos para poder ordenar
    let dataArray = Object.values(database).filter(dados => 
        dados.matricula.endsWith(`.${anoCorrente}`)
    );

    // Gerar a tabela HTML
    dataArray.forEach(dados => {
        html += `
            <tr>
                <td data-label="Matrícula">${dados.matricula}</td>
                <td data-label="Nome">${dados.nome}</td>
                <td data-label="Qtd Períodos">${dados.numeroDePeriodos}</td>
                <td data-label="Idade">${dados.idade}</td>
                <td data-label="Qtd Filho Men.">${dados.qtdfilhosmenores}</td>
                <td data-label="Antiguidade">${dados.antiguidade}</td>
                <td data-label="Pontuação Férias Escolar">${dados.pontuacaoferiasescolar || 0}</td>
                <td data-label="Pontuação Férias Não Escolar">${dados.pontuacaoferiasNaoescolar || 0}</td>
            </tr>`;
    });
    
    html += "</table>";
    document.getElementById("dados2").innerHTML = html;
}


// Exibe em ordem a pontuação das férias escolares
function exibirListaConcorrentesFeriasEscolarIPC() {
    let html = "<h3>Lista ordenada por potuação escolar - IPC</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Nome</th><th>Pont. Férias Escolar</th><th>Pont. Férias Não Escolar</th><th>Filhos em idade escolar</th><th>Casado com prof.?</th><th>Estudante ou aluno de ACADEPOL?</th></tr>";
    

    // Converter o objeto em um array de objetos para poder ordenar
    let anoCorrente = new Date().getFullYear().toString();
let dataArray = Object.values(database).filter(dados => 
    (dados.cargo === 'IPC' || dados.cargo === 'IPCplantao') && dados.matricula.endsWith(`.${anoCorrente}` )
);
    
    // Filtrar apenas os registros com pontuação de férias escolar maior que zero
    //let selecionados = dataArray.filter(dados => dados.pontuacaoferiasescolar && dados.pontuacaoferiasescolar > 0);
    
   // Ordenar os registros filtrados
   dataArray.sort((a, b) => {
    if (b.pontuacaoferiasescolar !== a.pontuacaoferiasescolar) {
        return b.pontuacaoferiasescolar - a.pontuacaoferiasescolar;
    } else if (b.gestante !== a.gestante) {
        return b.gestante - a.gestante;
    } else if (b.qtdfilhosmenores !== a.qtdfilhosmenores) {
       
        return b.qtdfilhosmenores - a.qtdfilhosmenores;
    }else if (b.estudante !== a.estudante) {
        
        return b.estudante - a.estudante;
    }else if (b.DoisEmpregos !== a.DoisEmpregos) {
        
        return b.DoisEmpregos - a.DoisEmpregos;
    } else if (b.antiguidade !== a.antiguidade) {
        
        return b.antiguidade - a.antiguidade;
    } else if (b.ConjugeMesmoPeriodo !== a.ConjugeMesmoPeriodo) {
        
        return b.ConjugeMesmoPeriodo - a.ConjugeMesmoPeriodo;
    }
    else{
        // Em caso de empate na pontuação, ordenar por idade em ordem decrescente
        return b.idadeDias - a.idadeDias;
    }
});


    // Limitar a exibição aos 6 primeiros resultados
    //let seisPrimeiros = selecionados.slice(0, 6);
    
    // Gerar a tabela HTML
    dataArray.forEach(dados => {
        html += `
            <tr>
                <td data-label="Matrícula">${dados.matricula}</td>
                <td data-label="Nome">${dados.nome}</td>
                <td data-label="Pontuação Férias Escolar">${dados.pontuacaoferiasescolar || 0}</td>
                <td data-label="Pontuação Férias Não Escolar">${dados.pontuacaoferiasNaoescolar || 0}</td>
                <td data-label="Filhos em idade escolar">${dados.possuiFilho}</td>
                <td data-label="Casado com prof.?">${dados.ecasadoComPofessor === "1" ? 'Sim' : 'Não'}</td>
                <td data-label="Estudante ou aluno de ACADEPOL?">${dados.estudanteOUaluno === 1 ? 'Sim' : 'Não'}</td>
                     
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


// Exibe em ordem a pontuação das férias escolares
function exibirListaConcorrentesFeriasEscolarEPC() {
    let html = "<h3>Lista ordenada por potuação escolar - EPC</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Nome</th><th>Pont. Férias Escolar</th><th>Pont. Férias Não Escolar</th><th>Filhos em idade escolar</th><th>Casado com prof.?</th><th>Estudante ou aluno de ACADEPOL?</th></tr>";
    
    // Converter o objeto em um array de objetos para poder ordenar
    let anoCorrente = new Date().getFullYear().toString();
let dataArray = Object.values(database).filter(dados => 
    (dados.cargo === 'EPC' || dados.cargo === 'EPCplantao') && dados.matricula.endsWith(`.${anoCorrente}`  )
);
    
    // Filtrar apenas os registros com pontuação de férias escolar maior que zero
    //let selecionados = dataArray.filter(dados => dados.pontuacaoferiasescolar && dados.pontuacaoferiasescolar > 0);
    
   // Ordenar os registros filtrados
   dataArray.sort((a, b) => {
    if (b.pontuacaoferiasescolar !== a.pontuacaoferiasescolar) {
        return b.pontuacaoferiasescolar - a.pontuacaoferiasescolar;
    } else if (b.gestante !== a.gestante) {
        return b.gestante - a.gestante;
    } else if (b.qtdfilhosmenores !== a.qtdfilhosmenores) {
       
        return b.qtdfilhosmenores - a.qtdfilhosmenores;
    }else if (b.estudante !== a.estudante) {
        
        return b.estudante - a.estudante;
    }else if (b.DoisEmpregos !== a.DoisEmpregos) {
        
        return b.DoisEmpregos - a.DoisEmpregos;
    } else if (b.antiguidade !== a.antiguidade) {
        
        return b.antiguidade - a.antiguidade;
    } else if (b.ConjugeMesmoPeriodo !== a.ConjugeMesmoPeriodo) {
        
        return b.ConjugeMesmoPeriodo - a.ConjugeMesmoPeriodo;
    }
    else{
        // Em caso de empate na pontuação, ordenar por idade em ordem decrescente
        return b.idadeDias - a.idadeDias;
    }
});


    // Limitar a exibição aos 6 primeiros resultados
    //let seisPrimeiros = selecionados.slice(0, 6);
    
    // Gerar a tabela HTML
    dataArray.forEach(dados => {
        html += `
            <tr>
            <td data-label="Matrícula">${dados.matricula}</td>
            <td data-label="Nome">${dados.nome}</td>
            <td data-label="Pontuação Férias Escolar">${dados.pontuacaoferiasescolar || 0}</td>
            <td data-label="Pontuação Férias Não Escolar">${dados.pontuacaoferiasNaoescolar || 0}</td>
            <td data-label="Filhos em idade escolar">${dados.possuiFilho}</td>
            <td data-label="Casado com prof.?">${dados.ecasadoComPofessor === "1" ? 'Sim' : 'Não'}</td>
            <td data-label="Estudante ou aluno de ACADEPOL?">${dados.estudanteOUaluno === 1 ? 'Sim' : 'Não'}</td>
                
               
              
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



// Exibe os 6 cadastros selecionados para ferias escolar
function exibirListaFinalFeriasEscolarSelecionadosIPC() {
    let html = "<h3>Lista Final de Selecionados para Férias Escolar em ordem</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Nome</th><th>Pont. Férias Escolar</th><th>Pont. Férias Não Escolar</th><th>Filhos em idade escolar</th><th>Casado com prof.?</th><th>Estudante ou aluno de ACADEPOL?</th></tr>";
    

    // Converter o objeto em um array de objetos para poder ordenar
    let anoCorrente = new Date().getFullYear().toString();
let dataArray = Object.values(database).filter(dados => 
    (dados.cargo === 'IPC' || dados.cargo === 'IPCplantao') &&
    dados.feriasescolarounao !== 0 && dados.matricula.endsWith(`.${anoCorrente}`)
);
    
    // Filtrar apenas os registros com pontuação de férias escolar maior que zero
    //let selecionados = dataArray.filter(dados => dados.pontuacaoferiasescolar && dados.pontuacaoferiasescolar > 0);
    
   // Ordenar os registros filtrados
   dataArray.sort((a, b) => {
    if (b.pontuacaoferiasescolar !== a.pontuacaoferiasescolar) {
        return b.pontuacaoferiasescolar - a.pontuacaoferiasescolar;
    } else if (b.gestante !== a.gestante) {
        return b.gestante - a.gestante;
    } else if (b.qtdfilhosmenores !== a.qtdfilhosmenores) {
       
        return b.qtdfilhosmenores - a.qtdfilhosmenores;
    }else if (b.estudante !== a.estudante) {
        
        return b.estudante - a.estudante;
    }else if (b.DoisEmpregos !== a.DoisEmpregos) {
        
        return b.DoisEmpregos - a.DoisEmpregos;
    } else if (b.antiguidade !== a.antiguidade) {
        
        return b.antiguidade - a.antiguidade;
    } else if (b.ConjugeMesmoPeriodo !== a.ConjugeMesmoPeriodo) {
        
        return b.ConjugeMesmoPeriodo - a.ConjugeMesmoPeriodo;
    }
    else{
        // Em caso de empate na pontuação, ordenar por idade em ordem decrescente
        return b.idadeDias - a.idadeDias;
    }
});


    // Limitar a exibição aos 6 primeiros resultados
    let seisPrimeiros = dataArray.slice(0, 6);
    
    // Gerar a tabela HTML
    seisPrimeiros.forEach(dados => {
        html += `
            <tr>
                <td data-label="Matrícula">${dados.matricula}</td>
                <td data-label="Nome">${dados.nome}</td>
                <td data-label="Pontuação Férias Escolar">${dados.pontuacaoferiasescolar || 0}</td>
                <td data-label="Pontuação Férias Não Escolar">${dados.pontuacaoferiasNaoescolar || 0}</td>
                <td data-label="Filhos em idade escolar">${dados.possuiFilho}</td>
                <td data-label="Casado com prof.?">${dados.ecasadoComPofessor === "1" ? 'Sim' : 'Não'}</td>
                <td data-label="Estudante ou aluno de ACADEPOL?">${dados.estudanteOUaluno === 1 ? 'Sim' : 'Não'}</td>
                     
            </tr>`;
    });

    /*seisPrimeiros.forEach(dados => {
        html += `<tr><td>${dados.matricula}</td><td>${dados.numeroDePeriodos}</td><td>${dados.pontuacaoferiasescolar || 0}</td><td>${dados.idade}</td></tr>`;
    });
    */
    html += "</table>";
    document.getElementById("dados2").innerHTML = html;
}


// Exibe os 6 cadastros selecionados para ferias escolar
function exibirListaFinalFeriasEscolarSelecionadosEPC() {
    let html = "<h3>Lista Final de Selecionados para Férias Escolar em ordem</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Nome</th><th>Pont. Férias Escolar</th><th>Pont. Férias Não Escolar</th><th>Filhos em idade escolar</th><th>Casado com prof.?</th><th>Estudante ou aluno de ACADEPOL?</th></tr>";
    
    // Converter o objeto em um array de objetos para poder ordenar
    let anoCorrente = new Date().getFullYear().toString();
    let dataArray = Object.values(database).filter(dados => 
    (dados.cargo === 'EPC' || dados.cargo === 'EPCplantao') &&
    dados.feriasescolarounao !== 0 && dados.matricula.endsWith(`.${anoCorrente}`) 
);
    
    // Filtrar apenas os registros com pontuação de férias escolar maior que zero
    //let selecionados = dataArray.filter(dados => dados.pontuacaoferiasescolar && dados.pontuacaoferiasescolar > 0);
    
   // Ordenar os registros filtrados
   dataArray.sort((a, b) => {
    if (b.pontuacaoferiasescolar !== a.pontuacaoferiasescolar) {
        return b.pontuacaoferiasescolar - a.pontuacaoferiasescolar;
    } else if (b.gestante !== a.gestante) {
        return b.gestante - a.gestante;
    } else if (b.qtdfilhosmenores !== a.qtdfilhosmenores) {
       
        return b.qtdfilhosmenores - a.qtdfilhosmenores;
    }else if (b.estudante !== a.estudante) {
        
        return b.estudante - a.estudante;
    }else if (b.DoisEmpregos !== a.DoisEmpregos) {
        
        return b.DoisEmpregos - a.DoisEmpregos;
    } else if (b.antiguidade !== a.antiguidade) {
        
        return b.antiguidade - a.antiguidade;
    } else if (b.ConjugeMesmoPeriodo !== a.ConjugeMesmoPeriodo) {
        
        return b.ConjugeMesmoPeriodo - a.ConjugeMesmoPeriodo;
    }
    else{
        // Em caso de empate na pontuação, ordenar por idade em ordem decrescente
        return b.idadeDias - a.idadeDias;
    }
});


    // Limitar a exibição aos 6 primeiros resultados
    let seisPrimeiros = dataArray.slice(0, 3);
    
    // Gerar a tabela HTML
    seisPrimeiros.forEach(dados => {
        html += `
            <tr>
            <td data-label="Matrícula">${dados.matricula}</td>
            <td data-label="Nome">${dados.nome}</td>
            <td data-label="Pontuação Férias Escolar">${dados.pontuacaoferiasescolar || 0}</td>
            <td data-label="Pontuação Férias Não Escolar">${dados.pontuacaoferiasNaoescolar || 0}</td>
            <td data-label="Filhos em idade escolar">${dados.possuiFilho}</td>
            <td data-label="Casado com prof.?">${dados.ecasadoComPofessor === "1" ? 'Sim' : 'Não'}</td>
            <td data-label="Estudante ou aluno de ACADEPOL?">${dados.estudanteOUaluno === 1 ? 'Sim' : 'Não'}</td>
                
               
              
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



function exibirListaFinalFeriasNaoEscolarIPC() {
    let html = "<h3>Lista Final de Férias Não Escolar IPC em ordem de Preferências</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Nome</th><th>Pont. não escolar</th><th>Gest?</th><th>Qtd Filho Men.</th><th>Estud.</th><th>2 vinc. mesmo periodo</th><th>Conj. com mesmo periodo</th><th>Antig.</th><th>Idade</th></tr>";
    
    let anoCorrente = new Date().getFullYear().toString();
let dataArray = Object.values(database).filter(dados => 
    (dados.cargo === 'IPC' || dados.cargo === 'IPCplantao') && dados.matricula.endsWith(`.${anoCorrente}`)
);
    
    dataArray.sort((a, b) => {
        if (b.gestante !== a.gestante) {
            return b.gestante - a.gestante;
        } else if (b.qtdfilhosmenores !== a.qtdfilhosmenores) {
            return b.qtdfilhosmenores - a.qtdfilhosmenores;
        } else if (b.estudante !== a.estudante) {
            return b.estudante - a.estudante;
        } else if (b.DoisEmpregos !== a.DoisEmpregos) {
            return b.DoisEmpregos - a.DoisEmpregos;
        } else if (b.antiguidade !== a.antiguidade) {
            return b.antiguidade - a.antiguidade;
        } else if (b.ConjugeMesmoPeriodo !== a.ConjugeMesmoPeriodo) {
            return b.ConjugeMesmoPeriodo - a.ConjugeMesmoPeriodo;
        } else {
            return b.idadeDias - a.idadeDias;
        }
    });

    dataArray.forEach(dados => {
        html += `
            <tr>
                <td data-label="Matrícula">${dados.matricula}</td>
                <td data-label="Nome">${dados.nome}</td>
                <td data-label="Cargo">${dados.pontuacaoferiasNaoescolar}</td> 
                <td data-label="Gestante?">${dados.gestante === 1 ? 'Sim' : 'Não'}</td>
                <td data-label="Qtd Filho Men.">${dados.qtdfilhosmenores}</td>
                <td data-label="Estudante?">${dados.estudante === 1 ? 'Sim' : 'Não'}</td>
                <td data-label="2 vinc. mesmo periodo">${dados.DoisEmpregos === 1 ? 'Sim' : 'Não'}</td>
                <td data-label="Conj. com mesmo periodo">${dados.ConjugeMesmoPeriodo === 1 ? 'Sim' : 'Não'}</td>
                <td data-label="Antig.">${dados.antiguidade}</td>
                <td data-label="Idade">${dados.idade}</td>
            </tr>`;
    });

    html += "</table>";
    document.getElementById("dados2").innerHTML = html;
}

function exibirListaFinalFeriasNaoEscolarEPC() {
    let html = "<h3>Lista Final de Férias Não Escolar EPC em ordem de Preferências</h3>";
    html += "<table border='1'>";
    html += "<tr><th>Matrícula</th><th>Nome</th><th>Pont. não escolar</th><th>Gest?</th><th>Qtd Filho Men.</th><th>Estud.</th><th>2 vinc. mesmo periodo</th><th>Conj. com mesmo periodo</th><th>Antig.</th><th>Idade</th></tr>";
    
    let anoCorrente = new Date().getFullYear().toString();
let dataArray = Object.values(database).filter(dados => 
    (dados.cargo === 'EPC' || dados.cargo === 'EPCplantao') && dados.matricula.endsWith(`.${anoCorrente}`)
);
    
    dataArray.sort((a, b) => {
        if (b.gestante !== a.gestante) {
            return b.gestante - a.gestante;
        } else if (b.qtdfilhosmenores !== a.qtdfilhosmenores) {
            return b.qtdfilhosmenores - a.qtdfilhosmenores;
        } else if (b.estudante !== a.estudante) {
            return b.estudante - a.estudante;
        } else if (b.DoisEmpregos !== a.DoisEmpregos) {
            return b.DoisEmpregos - a.DoisEmpregos;
        } else if (b.antiguidade !== a.antiguidade) {
            return b.antiguidade - a.antiguidade;
        } else if (b.ConjugeMesmoPeriodo !== a.ConjugeMesmoPeriodo) {
            return b.ConjugeMesmoPeriodo - a.ConjugeMesmoPeriodo;
        } else {
            return b.idadeDias - a.idadeDias;
        }
    });


    dataArray.forEach(dados => {
        html += `
            <tr>
                <td data-label="Matrícula">${dados.matricula}</td>
                <td data-label="Nome">${dados.nome}</td>
                <td data-label="Cargo">${dados.pontuacaoferiasNaoescolar}</td> 
                <td data-label="Gestante?">${dados.gestante === 1 ? 'Sim' : 'Não'}</td>
                <td data-label="Qtd Filho Men.">${dados.qtdfilhosmenores}</td>
                <td data-label="Estudante?">${dados.estudante === 1 ? 'Sim' : 'Não'}</td>
                <td data-label="2 vinc. mesmo periodo">${dados.DoisEmpregos === 1 ? 'Sim' : 'Não'}</td>
                <td data-label="Conj. com mesmo periodo">${dados.ConjugeMesmoPeriodo === 1 ? 'Sim' : 'Não'}</td>
                <td data-label="Antig.">${dados.antiguidade}</td>
                <td data-label="Idade">${dados.idade}</td>
            </tr>`;
    });

    html += "</table>";
    document.getElementById("dados2").innerHTML = html;
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
        //alert("Dados salvos com sucesso!");
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


function openCalendar() {
    window.open('calendario.html', '_blank');
}

function mostrarDiv() {
    document.getElementById('escolhadeferias').classList.remove('hidden');
}

function consultacriterios() {
    const matricula = document.getElementById("matriculaCadastro").value;
    window.open(`consultacriterios.html?matricula=${matricula}`);
}

function consultaferiasmarcadas() {
    const matricula = document.getElementById("matriculaCadastro").value;
    window.open(`consultaferiasmarcadas.html?matricula=${matricula}`);
}