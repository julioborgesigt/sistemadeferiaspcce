const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
      <html>
        <head>
          <title>Cadastro de Usuário</title>
        </head>
        <body>
          <h1>Cadastro de Usuário</h1>
          <form action="/cadastrar" method="POST">
            <label for="username">Nome:</label>
            <input type="text" id="username" name="username" required><br><br>
            <label for="birthdate">Data de Nascimento:</label>
            <input type="date" id="birthdate" name="birthdate" required><br><br>
            <button type="submit">Cadastrar</button>
          </form>
        </body>
      </html>
    `);
    return res.end();
  }

  if (pathname === '/cadastrar' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const params = new URLSearchParams(body);
      const username = params.get('username');
      const birthdate = params.get('birthdate');

      // Cria o arquivo de texto com os dados do usuário
      const userData = `Nome: ${username}\nData de Nascimento: ${birthdate}`;
      fs.writeFile(`${username}_data.txt`, userData, (err) => {
        if (err) {
          console.error('Erro ao criar o arquivo:', err);
          res.writeHead(500);
          return res.end('Erro interno do servidor');
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
          <html>
            <head>
              <title>Sucesso</title>
            </head>
            <body>
              <h1>Usuário cadastrado com sucesso!</h1>
              <p>Um arquivo foi criado com os dados do usuário.</p>
            </body>
          </html>
        `);
        return res.end();
      });
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
