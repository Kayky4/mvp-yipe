const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Certifique-se de que isso aponta para o index.js no models

const Attachment = sequelize.define('Attachment', {
    leadId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Leads',
            key: 'id'
        },
        allowNull: false
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fileType: {
        type: DataTypes.STRING,
        allowNull: false // Ex: 'imagem', 'documento', 'áudio', etc.
    }
}, {
    timestamps: true,
    tableName: 'Attachments'
});

module.exports = Attachment;
