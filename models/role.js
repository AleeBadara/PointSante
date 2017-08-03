/**
 * Retourne l'entié Role
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('role', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};