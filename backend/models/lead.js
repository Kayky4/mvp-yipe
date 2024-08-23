const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Lead = sequelize.define('Lead', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'novo'
    }
}, {
    timestamps: true,
    tableName: 'Leads'  // Nome da tabela explicitamente definido
});

module.exports = Lead;
