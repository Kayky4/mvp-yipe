const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rota de Login
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

        res.status(200).json({ message: 'Autenticação bem-sucedida', token, redirectUrl: '/mvp-yipe/frontend/index.html' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao autenticar usuário', details: error.message });
    }
});

// Rota para Redefinir Senha (Solicitação)
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        // Aqui você enviaria o token de redefinição para o email do usuário
        res.status(200).json({ message: 'Token de redefinição enviado para o email' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao solicitar redefinição de senha', details: error.message });
    }
});

// Rota para Atualizar Perfil
router.put('/me', authMiddleware, async (req, res) => {
    const { fullName, email, password, phone, profileImage, cpf } = req.body;

    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

        await user.update({ fullName, email, password: hashedPassword, phone, profileImage, cpf });
        res.status(200).json({ message: 'Perfil atualizado com sucesso', user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar perfil', details: error.message });
    }
});

module.exports = router;
