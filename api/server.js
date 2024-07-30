const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const crypto = require('crypto');
const cors = require('cors');

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fisioweb_db',
    password: '1973',
    port: 5432,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Função para criptografar a senha
const encryptPassword = (password) => {
    return crypto.createHash('md5').update(password).digest('hex');
};

// Rota para cadastrar um usuário
app.post('/usuarios', async (req, res) => {
    const { Nome, Email, Senha, CPF, RG, Telefone, Endereco, Cidade, Tipo, DataNascimento } = req.body;
    try {
        const senhaCriptografada = encryptPassword(Senha);
        const result = await pool.query(
            `INSERT INTO USUARIOS (Nome, Email, Senha, CPF, RG, Telefone, Endereco, Cidade, Tipo, DataNascimento)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [Nome, Email, senhaCriptografada, CPF, RG, Telefone, Endereco, Cidade, Tipo, DataNascimento]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para ler todos os dados de usuários
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM USUARIOS`);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'Nenhum usuário encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para login
app.post('/login', async (req, res) => {
    const { Email, Senha } = req.body;
    try {
        const senhaCriptografada = encryptPassword(Senha);
        const result = await pool.query(
            `SELECT * FROM USUARIOS WHERE Email = $1 AND Senha = $2`,
            [Email, senhaCriptografada]
        );
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login bem-sucedido', user: result.rows[0] });
        } else {
            res.status(401).json({ message: 'Email ou senha incorretos' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para listar todos os pacientes
app.get('/pacientes', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM USUARIOS WHERE Tipo = 'paciente'`);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'Nenhum paciente encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/profissionais', async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM USUARIOS WHERE Tipo = 'fisioterapeuta'`);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'Nenhum paciente encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
