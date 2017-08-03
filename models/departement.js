/**
 * Retourne l'entité Departement
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('departement', {
        codeDepartement: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        libelle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        couvert: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
};
