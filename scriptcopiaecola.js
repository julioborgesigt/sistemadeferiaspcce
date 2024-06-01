// Função para verificar a maior pontuação considerando os cargos equivalentes
function verificarMaiorPontuacao(cargosEquivalentes, pontuacaoUsuario, apenasVerificar = false) {
    let maiorPontuacao = 0;
    let matriculaMaiorPontuacao = '';
    let nomeMaiorPontuacao = '';

    for (let key in database) {
        if (database[key].cadastrado === 0 && 
            cargosEquivalentes.includes(database[key].cargo) && 
            database[key].pontuacaoferiasescolar && 
            database[key].pontuacaoferiasescolar > maiorPontuacao) {
            
            maiorPontuacao = database[key].pontuacaoferiasescolar;
            matriculaMaiorPontuacao = key;
            nomeMaiorPontuacao = database[key].nome;
        }
    }
    
    if (apenasVerificar) {
        if (pontuacaoUsuario >= maiorPontuacao) {
            alert("Você possui a maior pontuação.");
        } else {
            alert(`A maior pontuação é da matrícula ${matriculaMaiorPontuacao} - Nome: ${nomeMaiorPontuacao}.`);
        }
        return; // Não continuar com o cadastro
    }

    return { maiorPontuacao, matriculaMaiorPontuacao, nomeMaiorPontuacao };
}

// Função para verificar a maior pontuação considerando os cargos equivalentes e férias não escolares
function verificarMaiorPontuacaoNaoEscolar(cargosEquivalentes, pontuacaoUsuario, apenasVerificar = false) {
    let maiorPontuacao = 0;
    let matriculaMaiorPontuacao = '';
    let nomeMaiorPontuacao = '';

    for (let key in database) {
        if (database[key].cadastrado === 0 && 
            cargosEquivalentes.includes(database[key].cargo) && 
            database[key].pontuacaoferiasNaoescolar && 
            database[key].pontuacaoferiasNaoescolar > maiorPontuacao) {
            
            maiorPontuacao = database[key].pontuacaoferiasNaoescolar;
            matriculaMaiorPontuacao = key;
            nomeMaiorPontuacao = database[key].nome;
        }
    }
    
    if (apenasVerificar) {
        if (pontuacaoUsuario >= maiorPontuacao) {
            alert("Você possui a maior pontuação.");
        } else {
            alert(`A maior pontuação é da matrícula ${matriculaMaiorPontuacao} - Nome: ${nomeMaiorPontuacao}.`);
        }
        return; // Não continuar com o cadastro
    }

    return { maiorPontuacao, matriculaMaiorPontuacao, nomeMaiorPontuacao };
}

// Função para iniciar a verificação
function iniciarVerificacao(matricula, apenasVerificar = false) {
    const pontuacaoUsuario = database[matricula].pontuacaoferiasescolar || 0;
    const cargoUsuario = database[matricula].cargo;
    const tipodeferias = database[matricula].feriasescolarounao;
    let resultadoVerificacao;

    if (cargoUsuario === "EPC" || (cargoUsuario === "EPCplantao" && tipodeferias === 1)) {
        alert("Entrou na rotina EPC");
        resultadoVerificacao = verificarMaiorPontuacao(["EPC", "EPCplantao"], pontuacaoUsuario, apenasVerificar);
    } else if (cargoUsuario === "IPC" || (cargoUsuario === "IPCplantao" && tipodeferias === 1)) {
        alert("Entrou na rotina IPC");
        resultadoVerificacao = verificarMaiorPontuacao(["IPC", "IPCplantao"], pontuacaoUsuario, apenasVerificar);
    } else if (cargoUsuario === "EPC" || (cargoUsuario === "EPCplantao" && tipodeferias === 0)) {
        alert("Entrou na rotina EPC não escolar");
        resultadoVerificacao = verificarMaiorPontuacaoNaoEscolar(["EPC", "EPCplantao"], pontuacaoUsuario, apenasVerificar);
    } else if (cargoUsuario === "IPC" || (cargoUsuario === "IPCplantao" && tipodeferias === 0)) {
        alert("Entrou na rotina IPC não escolar");
        resultadoVerificacao = verificarMaiorPontuacaoNaoEscolar(["IPC", "IPCplantao"], pontuacaoUsuario, apenasVerificar);
    }

    if (!apenasVerificar) {
        // Verificar se a pontuação do usuário é maior ou igual à maior pontuação encontrada
        if (pontuacaoUsuario < resultadoVerificacao.maiorPontuacao) {
            alert(`A pontuação de férias escolares do usuário não é a maior do banco de dados. A maior pontuação é da matrícula ${resultadoVerificacao.matriculaMaiorPontuacao} - Nome: ${resultadoVerificacao.nomeMaiorPontuacao}. Cadastro não permitido.`);
            return false; // Não permitir a conclusão do cadastro
        }

        return true; // Permitir a conclusão do cadastro
    }
}

// Função para conclusão do cadastro
function concluirCadastro() {
    const matricula = document.getElementById("matriculaCadastro").value;

    // Verificar a pontuação do usuário antes de permitir a conclusão do cadastro
    if (iniciarVerificacao(matricula)) {
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
    iniciarVerificacao(matricula, true);
}
