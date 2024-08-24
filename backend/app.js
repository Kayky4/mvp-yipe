const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./models'); // Certifique-se de que isso aponta para o index.js nos models
const authRoutes = require('./routes/auth');
const crmRoutes = require('./routes/crm');
const pipelineRoutes = require('./routes/pipeline');
const cors = require('cors');  // Importe o pacote cors

dotenv.config();

const app = express();

// Configuração do CORS
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Permitir apenas o frontend rodando nessa origem
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para parsing de JSON
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/pipeline', pipelineRoutes);

// Conexão ao banco de dados
sequelize.sync({ force: false }) // force: false para não recriar as tabelas
    .then(() => {
        console.log('Conectado ao banco de dados e sincronizado com sucesso!');
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
