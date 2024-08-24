const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Certifique-se de que isso aponta para o index.js no models
const Stage = require('./stage'); // Importa o modelo Stage para estabelecer a associação

const Pipeline = sequelize.define('Pipeline', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'Pipelines'
});

// Estabelece a associação entre Pipeline e Stage
Pipeline.hasMany(Stage, {
    foreignKey: 'pipelineId',
    as: 'stages', // Nome do campo que conterá as etapas associadas
    onDelete: 'CASCADE' // Se um Pipeline for deletado, as etapas associadas também serão
});

Stage.belongsTo(Pipeline, {
    foreignKey: 'pipelineId',
    as: 'pipeline'
});

module.exports = Pipeline;
