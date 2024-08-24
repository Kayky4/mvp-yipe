const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const router = express.Router();

// Criação da aplicação Express
const app = express();

// Criação do servidor HTTP
const server = http.createServer(app);

// Configuração do Socket.io para WebSocket
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Quando um cliente se conecta
io.on('connection', (socket) => {
    console.log('Um cliente se conectou:', socket.id);

    socket.on('disconnect', () => {
        console.log('Um cliente se desconectou:', socket.id);
    });
});

// Rota de Exemplo
router.get('/api/example', (req, res) => {
    res.json({ message: 'Exemplo de API funcionando' });
});

// Usar o router configurado
app.use(router);

// Iniciar o servidor
server.listen(3016, () => {
    console.log('Servidor rodando na porta 3016');
});

// Exportar io para uso em outros módulos
module.exports = { app, io };
