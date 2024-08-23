const express = require('express');
const Pipeline = require('../models/pipeline');
const Stage = require('../models/stage');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Criar Funil
router.post('/pipelines', authMiddleware, async (req, res) => {
    const { name } = req.body;

    try {
        const pipeline = await Pipeline.create({ name, createdBy: req.user.id });
        res.status(201).json({ message: 'Funil criado com sucesso', pipeline });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar funil', details: error.message });
    }
});

// Criar Etapa
router.post('/stages', authMiddleware, async (req, res) => {
    const { name, pipelineId, order, content } = req.body;

    try {
        const stage = await Stage.create({ name, pipelineId, order, content });
        res.status(201).json({ message: 'Etapa criada com sucesso', stage });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar etapa', details: error.message });
    }
});

// Atualizar Etapa
router.put('/stages/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, order, content } = req.body;

    try {
        const stage = await Stage.findByPk(id);
        if (!stage) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        await stage.update({ name, order, content });
        res.status(200).json({ message: 'Etapa atualizada com sucesso', stage });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar etapa', details: error.message });
    }
});

module.exports = router;
