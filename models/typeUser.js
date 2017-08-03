/**
 * Retourne l'entité TypeUser
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('typeUser', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        libelle: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
