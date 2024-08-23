const express = require('express');
const router = express.Router();

// Rota de Exemplo
router.get('/api/example', (req, res) => {
    res.json({ message: 'Exemplo de API funcionando' });
});

module.exports = router;
