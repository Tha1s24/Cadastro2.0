const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs'); // npm install bcryptjs

const SALT_ROUNDS = 10;

/* =========================
   LISTAR TODOS USUÁRIOS (sem senha)
========================= */
router.get('/', async(req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nome, email, telefone FROM users'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

/* =========================
   OBTER USUÁRIO POR ID (sem senha)
========================= */
router.get('/:id', async(req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nome, email, telefone FROM users WHERE id = ?', [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

/* =========================
   CRIAR USUÁRIO
========================= */
router.post('/', async(req, res) => {
    const { nome, email, telefone, senha } = req.body;

    // Validações
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'nome, email e senha são obrigatórios' });
    }

    if (nome.length > 50) {
        return res.status(400).json({ error: 'O nome deve conter no máximo 50 caracteres' });
    }

    try {
        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

        const [result] = await db.query(
            'INSERT INTO users (nome, email, telefone, senha) VALUES (?, ?, ?, ?)', [nome, email, telefone || null, hashedPassword]
        );

        res.status(201).json({
            id: result.insertId,
            nome,
            email,
            telefone
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

/* =========================
   ATUALIZAR USUÁRIO
========================= */
router.put('/:id', async(req, res) => {
    const { nome, email, telefone, senha } = req.body;

    if (nome && nome.length > 50) {
        return res.status(400).json({ error: 'O nome deve conter no máximo 50 caracteres' });
    }

    try {
        // Se senha foi enviada, hash
        let hashedPassword = undefined;
        if (senha) {
            hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);
        }

        // Monta query dinamicamente
        const query = `
            UPDATE users SET
                nome = ?,
                email = ?,
                telefone = ?${hashedPassword ? ', senha = ?' : ''}
            WHERE id = ?
        `;
        const params = hashedPassword ?
            [nome, email, telefone || null, hashedPassword, req.params.id] :
            [nome, email, telefone || null, req.params.id];

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ id: Number(req.params.id), nome, email, telefone });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

/* =========================
   REMOVER USUÁRIO
========================= */
router.delete('/:id', async(req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
});

module.exports = router;