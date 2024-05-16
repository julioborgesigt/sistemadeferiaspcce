const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const filePath = path.join(__dirname, 'funcionarios.txt');

app.post('/funcionarios', (req, res) => {
    const { nome, matricula } = req.body;
    const novaLinha = `Nome: ${nome}, Matrícula: ${matricula}\n`;

    fs.appendFile(filePath, novaLinha, err => {
        if (err) {
            console.error('Erro ao salvar no arquivo', err);
            res.status(500).send('Erro ao salvar dados');
        } else {
            res.status(200).send('Dados salvos com sucesso');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

function enviarDados() {
    const nome = document.getElementById('nome').value;
    const matricula = document.getElementById('matricula').value;

    fetch('http://localhost:3000/funcionarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, matricula })
    })
    .then(response => {
        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
        } else {
            alert('Falha ao realizar cadastro.');
        }
    })
    .catch(error => alert('Erro ao enviar dados: ' + error));
}