const express = require('express');
const Stage = require('../models/stage'); // Certifique-se de que este é o modelo correto
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para criar uma nova etapa (stage)
router.post('/stages', authMiddleware, async (req, res) => {
    const { name, pipelineId, order, content } = req.body;

    try {
        const stage = await Stage.create({ name, pipelineId, order, content });
        res.status(201).json({ message: 'Etapa criada com sucesso', stage });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar etapa', details: error.message });
    }
});

// Rota para listar todas as etapas (stages)
router.get('/stages', authMiddleware, async (req, res) => {
    try {
        const stages = await Stage.findAll();
        res.status(200).json(stages);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar etapas' });
    }
});

// Rota para atualizar uma etapa (stage)
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

// Rota para deletar uma etapa (stage)
router.delete('/stages/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const stage = await Stage.findByPk(id);
        if (!stage) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        await stage.destroy();
        res.status(200).json({ message: 'Etapa deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar etapa', details: error.message });
    }
});

module.exports = router;
