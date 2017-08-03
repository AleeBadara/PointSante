/**
 * Retourne l'entité DemandeTransport
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('demandeTransport', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        dateDemande: {
            type: DataTypes.DATE,
            allowNull: false
        },
        dateReponse: {
            type: DataTypes.DATE,
            allowNull: false
        },
        lieuDepart: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10, 200]
            }
        },
        lieuArrivee: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10, 200]
            }
        },
        dateService: {
            type: DataTypes.DATE,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        validationDemandeur: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        validationAmbulancier: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        dateValidationDemandeur: {
            type: DataTypes.DATE
        },
        dateValidationAmbulancier: {
            type: DataTypes.DATE
        }
    });
};