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

app.get('/atendimentos', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                atendimentos.numeroatendimento AS id, 
                pacientes.nome AS pacienteNome, 
                profissionais.nome AS profissionalNome, 
                atendimentos.dataatendimento AS data, 
                atendimentos.horario AS hora,
                atendimentos.cid AS cid,
                atendimentos.horariosaida AS horarioSaida,
                atendimentos.obslocal AS obsLocal
            FROM 
                atendimentos 
            JOIN usuarios AS pacientes ON atendimentos.usuarioid = pacientes.id 
            JOIN usuarios AS profissionais ON atendimentos.fisioterapeutaid = profissionais.id
        `);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows);
        } else {
            res.status(404).json({ message: 'Nenhum atendimento encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para criar um novo atendimento
app.post('/atendimentos', async (req, res) => {
    const { pacienteId, profissionalId, data, horario, cid, horarioSaida } = req.body;
    try {
        // Verifica a disponibilidade do profissional
        const disponibilidadeResult = await pool.query(
            `SELECT * FROM atendimentos 
             WHERE fisioterapeutaid = $1 
             AND dataatendimento = $2 
             AND horario = $3`,
            [profissionalId, data, horario]
        );

        if (disponibilidadeResult.rows.length > 0) {
            return res.status(400).json({ message: 'Profissional não disponível nesse horário.' });
        }

        // Se o profissional estiver disponível, cria o atendimento
        const result = await pool.query(
            `INSERT INTO atendimentos (usuarioid, fisioterapeutaid, dataatendimento, horario, cid, horariosaida)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [pacienteId, profissionalId, data, horario, cid, horarioSaida]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Rota para verificar a disponibilidade do profissional
app.post('/disponibilidade', async (req, res) => {
    const { profissionalId, data, horario, horarioSaida } = req.body;

    try {
        const result = await pool.query(`
            SELECT * FROM atendimentos
            WHERE fisioterapeutaid = $1 AND dataatendimento = $2
            AND (
                (horario <= $3 AND $3 < horarioSaida) OR
                (horario < $4 AND $4 <= horarioSaida) OR
                ($3 <= horario AND horarioSaida <= $4) OR
                (horario = $3 AND horarioSaida = $4)
            )
        `, [profissionalId, data, horario, horarioSaida]);

        res.json({ disponível: result.rowCount === 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
