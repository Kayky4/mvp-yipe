const express = require('express');
const Pipeline = require('../models/pipeline');
const Stage = require('../models/stage');
const authMiddleware = require('../middleware/authMiddleware');
const io = require('../index');  // Caminho para o arquivo index.js

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
        const pipelineExists = await Pipeline.findByPk(pipelineId);
        if (!pipelineExists) {
            return res.status(400).json({ error: 'Pipeline ID inválido ou inexistente' });
        }

        const stage = await Stage.create({ name, pipelineId, order, content });
        
        // Emitir evento para clientes conectados
        io.emit('stageCreated', stage);

        res.status(201).json({ message: 'Etapa criada com sucesso', stage });
    } catch (error) {
        console.error('Erro ao criar etapa:', error);
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

// Salvar conteúdo em uma etapa existente
router.post('/stages/:stageId/content', authMiddleware, async (req, res) => {
    const { stageId } = req.params;
    const contentData = req.body;

    try {
        const stage = await Stage.findByPk(stageId);

        if (!stage) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        const currentContent = stage.content || {};
        const updatedContent = { ...currentContent, ...contentData };

        await stage.update({ content: updatedContent });

        res.status(200).json({ message: 'Conteúdo adicionado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar conteúdo', details: error.message });
    }
});

// Listar todas as etapas
router.get('/stages', authMiddleware, async (req, res) => {
    try {
        const stages = await Stage.findAll({
            include: {
                model: Pipeline,
                attributes: ['name'],
            },
        });
        res.status(200).json(stages);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar etapas', details: error.message });
    }
});

// Deletar uma etapa
router.delete('/stages/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const stage = await Stage.findByPk(id);
        if (!stage) {
            console.error('Etapa não encontrada:', id);
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        await stage.destroy();
        res.status(200).json({ message: 'Etapa deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar etapa:', error);
        res.status(500).json({ error: 'Erro ao deletar etapa', details: error.message });
    }
});



module.exports = router;
