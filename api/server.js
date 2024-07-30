const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fisioweb_db',
    password: '1973',
    port: 5432,
});

const app = express();
app.use(bodyParser.json());

// Rota para cadastrar um usuário
app.post('/usuarios', async (req, res) => {
    const { Nome, Email, Senha, CPF, RG, Telefone, Endereco, Cidade, Tipo, DataNascimento } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO USUARIOS (Nome, Email, Senha, CPF, RG, Telefone, Endereco, Cidade, Tipo, DataNascimento)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [Nome, Email, Senha, CPF, RG, Telefone, Endereco, Cidade, Tipo, DataNascimento]
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

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});