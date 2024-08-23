const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Certifique-se de que isso aponta para o index.js no models

const Interaction = sequelize.define('Interaction', {
    leadId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Leads',
            key: 'id'
        },
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false // Ex: texto, áudio, imagem, vídeo, documento
    }
}, {
    timestamps: true,
    tableName: 'Interactions'
});

module.exports = Interaction;
