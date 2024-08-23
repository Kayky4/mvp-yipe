const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Este email já está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ fullName, email, password: hashedPassword });

        res.status(201).json({ message: 'Usuário criado com sucesso', user });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});

// Rota para autenticar um usuário
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Autenticação bem-sucedida', token });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ error: 'Erro ao autenticar usuário', details: error.message });
    }
});

// Rota para obter dados do usuário autenticado
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter os dados do usuário' });
    }
});

module.exports = router;
