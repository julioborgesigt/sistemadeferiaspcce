const express = require('express');
const axios = require('axios');
const app = express();


// Rota para carregar o arquivo JSON remoto
app.get('/load-json', async (req, res) => {
    try {
        // URL do arquivo remoto no Google Drive
        const url = 'https://drive.google.com/uc?export=download&id=12t_iDdlHkz8DMmr6twUuE1vwxs24IaqN';

        // Faça a solicitação para o arquivo remoto
        const response = await fetch(url);

        // Verifique se a solicitação foi bem-sucedida
        if (!response.ok) {
            throw new Error('Falha ao carregar o arquivo.');
        }

        // Obtenha os dados JSON do corpo da resposta
        const data = await response.json();

        // Envie os dados JSON como resposta para o cliente
        res.json(data);
    } catch (error) {
        console.error('Erro ao carregar o arquivo:', error);
        res.status(500).json({ error: 'Erro ao carregar o arquivo.' });
    }
});

// Inicie o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});
