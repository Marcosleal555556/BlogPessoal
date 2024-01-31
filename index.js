const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',
    password: 'marcos',
    database: 'meu_blog'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

// Configuração do Express
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'seu_segredo',
    resave: true,
    saveUninitialized: true
}));

// Rotas
app.get('/', (req, res) => {
    res.render('home');
});

// Adicione rotas para as outras páginas (sobre, contato, postagens)

// Rota de login
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Autenticação - exemplo básico, use bcrypt na prática
    if (usuario === 'admin' && senha === 'senha') {
        req.session.authenticated = true;
        res.redirect('/admin/postagens');
    } else {
        res.redirect('/login');
    }
});

// Middleware para verificar a autenticação
function isAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Rota para o painel de administração de postagens
app.get('/admin/postagens', isAuthenticated, (req, res) => {
    // Buscar postagens do banco de dados
    db.query('SELECT * FROM postagens', (err, results) => {
        if (err) throw err;
        res.render('postagens', { postagens: results });
    });
});

// Adicione rotas para adicionar, editar e excluir postagens

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
