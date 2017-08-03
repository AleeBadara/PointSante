/**
 * Retourne l'entité TypeVehicule
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('typeVehicule', {
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