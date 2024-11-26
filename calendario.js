document.addEventListener('DOMContentLoaded', () => {
    fetch('banco_dados.json')
        .then(response => response.json())
        .then(database => {
            // Adiciona eventos aos botões
            document.getElementById('anoCorrenteIPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'block';
                document.getElementById('calendarioProximo').style.display = 'none';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Ano Corrente - IPC';
                criarCalendario(database, new Date().getFullYear(), 'calendarioCorrente', ['IPC', 'IPCplantao']);
            });

            document.getElementById('proximoAnoIPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'none';
                document.getElementById('calendarioProximo').style.display = 'block';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Próximo Ano - IPC';
                criarCalendario(database, new Date().getFullYear() + 1, 'calendarioProximo', ['IPC', 'IPCplantao']);
            });

            document.getElementById('anoCorrentemais2IPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'none';
                document.getElementById('calendarioProximo').style.display = 'block';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Próximo Ano - IPC';
                criarCalendario(database, new Date().getFullYear() + 2, 'calendarioProximo', ['IPC', 'IPCplantao']);
            });

            document.getElementById('anoCorrenteEPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'block';
                document.getElementById('calendarioProximo').style.display = 'none';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Ano Corrente - EPC';
                criarCalendario(database, new Date().getFullYear(), 'calendarioCorrente', ['EPC', 'EPCplantao']);
            });

            document.getElementById('proximoAnoEPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'none';
                document.getElementById('calendarioProximo').style.display = 'block';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Próximo Ano - EPC';
                criarCalendario(database, new Date().getFullYear() + 1, 'calendarioProximo', ['EPC', 'EPCplantao']);
            });

            document.getElementById('anoCorrentemais2EPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'none';
                document.getElementById('calendarioProximo').style.display = 'block';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Próximo Ano - EPC';
                criarCalendario(database, new Date().getFullYear() + 2, 'calendarioProximo', ['EPC', 'EPCplantao']);
            });


            document.getElementById('anoCorrenteDPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'block';
                document.getElementById('calendarioProximo').style.display = 'none';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Ano Corrente - EPC';
                criarCalendario(database, new Date().getFullYear(), 'calendarioCorrente', ['DPC', 'DPCplantao']);
            });

            document.getElementById('proximoAnoDPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'none';
                document.getElementById('calendarioProximo').style.display = 'block';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Próximo Ano - EPC';
                criarCalendario(database, new Date().getFullYear() + 1, 'calendarioProximo', ['DPC', 'DPCplantao']);
            });

            document.getElementById('anoCorrentemais2DPCBtn').addEventListener('click', () => {
                document.getElementById('calendarioCorrente').style.display = 'none';
                document.getElementById('calendarioProximo').style.display = 'block';
                document.getElementById('tituloCalendario').innerText = 'Calendário de Férias - Próximo Ano - EPC';
                criarCalendario(database, new Date().getFullYear() + 2, 'calendarioProximo', ['DPC', 'DPCplantao']);
            });

            // Inicializa com o calendário corrente IPC
            criarCalendario(database, new Date().getFullYear(), 'calendarioCorrente', ['IPC', 'IPCplantao']);
        })
        .catch(error => {
            console.error('Erro ao carregar o banco de dados:', error);
            document.getElementById('info').innerHTML = "<p>Erro ao carregar o banco de dados.</p>";
        });
});

function criarCalendario(database, ano, containerId, cargos) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Limpa o conteúdo anterior
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const cores = ['#FF6347', '#FFD700', '#90EE90', '#1E90FF', '#9370DB', '#FF69B4', '#FFA500', '#00CED1', '#8B4513', '#00FF7F'];
    const corUsuario = {};

    const datasFerias = [];
    let corIndex = 0;
    for (const usuario in database) {
        if (!cargos.includes(database[usuario].cargo)) {
            continue; // Ignora usuários que não pertencem aos cargos especificados
        }
        
        corUsuario[usuario] = cores[corIndex % cores.length];
        corIndex++;

        const periodos = [
            { inicio: database[usuario].periodo11, fim: database[usuario].periodo12 },
            { inicio: database[usuario].periodo21, fim: database[usuario].periodo22 },
            { inicio: database[usuario].periodo31, fim: database[usuario].periodo32 }
        ];

        periodos.forEach(periodo => {
            if (periodo.inicio && periodo.fim) {
                const [inicioDia, inicioMes, inicioAno] = periodo.inicio.split('/');
                const [fimDia, fimMes, fimAno] = periodo.fim.split('/');
                const inicio = new Date(`${inicioAno}-${inicioMes}-${inicioDia}`);
                const fim = new Date(`${fimAno}-${fimMes}-${fimDia}`);

                for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
                    const dataStr = new Date(d).toISOString().split('T')[0];
                    const feriasData = datasFerias.find(f => f.data === dataStr);
                    if (feriasData) {
                        feriasData.usuarios.push(database[usuario].nome);
                    } else {
                        datasFerias.push({ data: dataStr, usuarios: [database[usuario].nome] });
                    }
                }
            }
        });
    }

    for (let mes = 0; mes < 12; mes++) {
        const table = document.createElement('table');
        table.classList.add('calendario');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const th = document.createElement('th');
        th.colSpan = 7;
        th.textContent = meses[mes];
        headerRow.appendChild(th);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const diasHeaderRow = document.createElement('tr');
        diasSemana.forEach(dia => {
            const diaTh = document.createElement('th');
            diaTh.textContent = dia;
            diasHeaderRow.appendChild(diaTh);
        });
        tbody.appendChild(diasHeaderRow);

        const primeiroDia = new Date(ano, mes, 1).getDay();
        const ultimoDia = new Date(ano, mes + 1, 0).getDate();
        let diaAtual = 1;

        for (let semana = 0; semana < 6; semana++) {
            const row = document.createElement('tr');
            for (let dia = 0; dia < 7; dia++) {
                const cell = document.createElement('td');
                if (semana === 0 && dia < primeiroDia) {
                    cell.textContent = '';
                } else if (diaAtual > ultimoDia) {
                    cell.textContent = '';
                } else {
                    const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(diaAtual).padStart(2, '0')}`;
                    const feriasData = datasFerias.find(f => f.data === dataStr);
                    cell.textContent = diaAtual;
                    if (feriasData) {
                        cell.style.backgroundColor = corUsuario[feriasData.usuarios[0]];
                        cell.title = feriasData.usuarios.join(', ');

                        // Adiciona os nomes dos usuários abaixo do dia
                        const usuariosDiv = document.createElement('div');
                        usuariosDiv.style.fontSize = '0.7em';
                        usuariosDiv.style.marginTop = '5px';
                        usuariosDiv.textContent = feriasData.usuarios.join(', ');
                        cell.appendChild(usuariosDiv);
                    }
                    diaAtual++;
                }
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        container.appendChild(table);
    }
}


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