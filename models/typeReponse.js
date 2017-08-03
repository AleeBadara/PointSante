/**
 * Retourne l'entité TypeReponse
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('typeReponse', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        libelle: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};