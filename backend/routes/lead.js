const express = require('express');
const Lead = require('../models/lead');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para criar um novo lead
router.post('/', authMiddleware, async (req, res) => {
    const { name, email, phone, status } = req.body;

    try {
        const lead = await Lead.create({ name, email, phone, status });
        res.status(201).json({ message: 'Lead criado com sucesso', lead });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar lead', details: error.message });
    }
});

// Rota para listar todos os leads
router.get('/', authMiddleware, async (req, res) => {
    try {
        const leads = await Lead.findAll();
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar leads' });
    }
});

// Rota para atualizar um lead
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;

    try {
        const lead = await Lead.findByPk(id);
        if (!lead) {
            return res.status(404).json({ error: 'Lead não encontrado' });
        }

        await lead.update({ name, email, phone, status });
        res.status(200).json({ message: 'Lead atualizado com sucesso', lead });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar lead', details: error.message });
    }
});

// Rota para deletar um lead
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const lead = await Lead.findByPk(id);
        if (!lead) {
            return res.status(404).json({ error: 'Lead não encontrado' });
        }

        await lead.destroy();
        res.status(200).json({ message: 'Lead deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar lead', details: error.message });
    }
});

module.exports = router;
