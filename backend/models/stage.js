const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Certifique-se de que isso aponta para o index.js no models

const Stage = sequelize.define('Stage', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pipelineId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true // Conteúdo opcional para cada etapa
    }
}, {
    timestamps: true,
    tableName: 'Stages'
});

module.exports = Stage;
