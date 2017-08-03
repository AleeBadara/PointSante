/**
 * Retourne l'entité Menu
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('menu', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        libelle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rang: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};