const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const filePath = path.join(__dirname, 'funcionarios.txt');

app.post('/funcionarios', (req, res) => {
    const { nome, matricula } = req.body;
    const novaLinha = `Nome: ${nome}, Matrícula: ${matricula}\n`;

    const server = http.createServer((req,res)=>{
        fs.appendFile('funcionarios.txt', novaLinha,(err)=>{
            if (err) {
                console.error('Erro ao salvar no arquivo', err);
                res.status(500).send('Erro ao salvar dados');
            } else {
                res.status(200).send('Dados salvos com sucesso');
            }
            return res.end()
        })
    
    })



    
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
