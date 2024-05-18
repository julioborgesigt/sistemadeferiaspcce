const express = require('express');
const fs = require('fs'); // Módulo file system para trabalhar com arquivos
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Banco de dados fictício
//let database = {};

// Caminho para o arquivo banco_dados.json
const arquivoBancoDados = path.join(__dirname, 'banco_dados.json');

// Middleware para lidar com solicitações JSON
app.use(express.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Rota para lidar com solicitações POST para /banco_dados.json
app.post('/banco_dados.json', (req, res) => {
  // Extrair os dados recebidos da solicitação
  const novosDados = req.body;
  console.log(novosDados);

   // Escrever os novos dados diretamente no arquivo banco_dados.json
   fs.writeFile(arquivoBancoDados, JSON.stringify(novosDados), (err) => {
    if (err) {
      // Se houver erro ao escrever no arquivo, enviar uma resposta de erro
      console.error('Erro ao salvar os dados:', err);
      res.status(500).send('Erro ao salvar os dados');
    } else {
      // Se os dados foram escritos com sucesso, enviar uma resposta de sucesso
      console.log('Dados salvos com sucesso');
      res.send('Solicitação POST recebida com sucesso');
    }
  });

});


// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
