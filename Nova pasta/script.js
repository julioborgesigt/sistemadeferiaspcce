const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); // Para parsing de JSON no corpo das requisições

const filePath = path.join('C:', 'Users', 'Pc', 'OneDrive', 'Desktop', 'programacao', 'dados.txt');

app.post('/save', (req, res) => {
    const { matricula, idade, filhos, antiguidade } = req.body;
    const dataToSave = `Matrícula: ${matricula}, Idade: ${idade}, Filhos: ${filhos}, Antiguidade: ${antiguidade}\n`;

    // Verifica se o arquivo existe e então escreve ou cria um novo
    fs.appendFile(filePath, dataToSave, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Erro ao salvar os dados' });
        }

        // Leitura do arquivo para enviar os dados atualizados
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'Erro ao ler os dados' });
            }

            const lines = data.trim().split('\n');
            const result = lines.map(line => {
                const parts = line.split(', ');
                return {
                    matricula: parts[0].split(': ')[1],
                    idade: parts[1].split(': ')[1],
                    filhos: parts[2].split(': ')[1],
                    antiguidade: parts[3].split(': ')[1]
                };
            });

            res.send({ result });
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
