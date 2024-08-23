const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // Certifique-se de que isso aponta para o index.js no models

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

module.exports = Pipeline;
