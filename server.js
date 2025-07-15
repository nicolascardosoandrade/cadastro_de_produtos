require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));
// Configuração do body-parser para interpretar dados do formulário


// Middleware para interpretar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '1234',
  database: process.env.DB_NAME || 'cadastro_produtos',
});

// Testa a conexão
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

// Rota para o formulário principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para cadastrar produto
app.post('/produtos', (req, res) => {
  const { nome, descricao, preco, estoque } = req.body;

  const sql = `INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)`;
  const values = [nome, descricao, preco, estoque];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao inserir produto:', err);
      return res.status(500).send('Erro ao cadastrar produto');
    }
    res.send(`
      <h3>Produto cadastrado com sucesso!</h3>
      <a href="/">Cadastrar outro</a>
    `);
  });
});

// Rota para buscar produtos por preço
app.get('/estoque', (req, res) => {
  const min = parseFloat(req.query.precomin);
  const max = parseFloat(req.query.precomax);

  if (isNaN(min) || isNaN(max)) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }

  const sql = 'SELECT nome, preco, estoque FROM produtos WHERE preco BETWEEN ? AND ?';
  db.query(sql, [min, max], (err, results) => {
    if (err) {
      console.error('Erro na busca:', err);
      return res.status(500).json({ error: 'Erro no banco de dados' });
    }
    res.json(results);
  });
});

const { exec } = require('child_process');

// Inicia o servidor
app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`Servidor rodando em ${url}`);

  // Abrir o navegador no Windows
  exec(`start ${url}`);
});
