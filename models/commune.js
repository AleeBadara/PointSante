/**
 * Retourne l'entité Commune
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('commune', {
        libelle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        codePostal: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5, 5]
            }
        },
        codeInsee: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            validate: {
                len: [5, 5]
            }
        }
    });

};
