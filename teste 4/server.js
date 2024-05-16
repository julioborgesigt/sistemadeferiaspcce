const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); // Para parsear JSON no corpo das requisições

const filePath = path.join(__dirname, 'funcionarios.txt');

app.post('/funcionarios', (req, res) => {
    const { nome, matricula } = req.body;
    const newEntry = `${nome}, ${matricula}\n`;

    fs.appendFile(filePath, newEntry, (err) => {
        if (err) {
            console.error('Erro ao salvar no arquivo:', err);
            return res.status(500).send({ message: 'Erro ao salvar os dados' });
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Erro ao ler o arquivo:', err);
                return res.status(500).send({ message: 'Erro ao ler os dados' });
            }

            const funcionarios = data.trim().split('\n').map(line => {
                const [nome, matricula] = line.split(', ');
                return { nome, matricula };
            });

            res.json(funcionarios);
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
