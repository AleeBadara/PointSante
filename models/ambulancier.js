/**
 * Retourne l'entité Ambulancier
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ambulancier', {
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            validate: {
                isEmail: true
            }
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 100]
            }
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 100]
            }
        },
        imei: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [15, 15]
            }
        },
        disponible: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        latitude: {
            type: DataTypes.DOUBLE
        },
        longitude: {
            type: DataTypes.DOUBLE
        }

    }, {
            hooks: {
                beforeValidate: function (ambulancier, options) {
                    if (typeof ambulancier.mail === 'string') {
                        ambulancier.mail = ambulancier.mail.toLowerCase();
                    }
                }
            }
        });
};