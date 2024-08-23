const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Certifique-se de que isso aponta para o index.js no models

const Reminder = sequelize.define('Reminder', {
    leadId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Leads',
            key: 'id'
        },
        allowNull: false
    },
    reminderDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'Reminders'
});

module.exports = Reminder;
