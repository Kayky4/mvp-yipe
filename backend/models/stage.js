const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Pipeline = require('./pipeline'); // Certifique-se de que o modelo Pipeline está corretamente importado

const Stage = sequelize.define('Stage', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pipelineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pipeline, // Associa a chave estrangeira ao modelo Pipeline
            key: 'id'
        },
        onDelete: 'CASCADE', // Adiciona comportamento de cascata para deletar
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.JSONB, // Para armazenar os conteúdos (mensagens, áudios, imagens, etc.)
        allowNull: true // Pode ser nulo inicialmente
    }
}, {
    timestamps: true,
    tableName: 'Stages'
});

// Define a associação entre Pipeline e Stage
Pipeline.hasMany(Stage, { foreignKey: 'pipelineId', onDelete: 'CASCADE' });
Stage.belongsTo(Pipeline, { foreignKey: 'pipelineId' });

module.exports = Stage;
