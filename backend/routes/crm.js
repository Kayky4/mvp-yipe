const express = require('express');
const Lead = require('../models/lead');
const Stage = require('../models/stage');
const Interaction = require('../models/interaction');
const Attachment = require('../models/attachment');
const Reminder = require('../models/reminder');
const Pipeline = require('../models/pipeline');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Criar Lead
router.post('/leads', authMiddleware, async (req, res) => {
    const { name, email, phone, stageId, userId } = req.body;

    try {
        const lead = await Lead.create({ name, email, phone, stageId, userId: req.user.id });
        res.status(201).json({ message: 'Lead criado com sucesso', lead });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar lead', details: error.message });
    }
});

// Movimentar Lead entre Etapas
router.put('/leads/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { stageId } = req.body;

    try {
        const lead = await Lead.findByPk(id);
        if (!lead) {
            return res.status(404).json({ error: 'Lead não encontrado' });
        }

        await lead.update({ stageId });
        res.status(200).json({ message: 'Lead movido com sucesso', lead });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao movimentar lead', details: error.message });
    }
});

// Adicionar Interação
router.post('/leads/:id/interactions', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { content, type } = req.body;

    try {
        const interaction = await Interaction.create({ leadId: id, content, type });
        res.status(201).json({ message: 'Interação adicionada com sucesso', interaction });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar interação', details: error.message });
    }
});

// Adicionar Anexo
router.post('/leads/:id/attachments', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { filePath, fileType } = req.body;

    try {
        const attachment = await Attachment.create({ leadId: id, filePath, fileType });
        res.status(201).json({ message: 'Anexo adicionado com sucesso', attachment });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar anexo', details: error.message });
    }
});

// Configurar Lembrete
router.post('/leads/:id/reminders', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { reminderDate, description } = req.body;

    try {
        const reminder = await Reminder.create({ leadId: id, reminderDate, description });
        res.status(201).json({ message: 'Lembrete configurado com sucesso', reminder });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao configurar lembrete', details: error.message });
    }
});

module.exports = router;
