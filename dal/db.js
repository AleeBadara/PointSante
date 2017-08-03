/* Fichier d'accés à la base de données */

const path = require('path');
// ORM
const Sequelize = require('sequelize');

let dbName;
let dbEnv = process.env.NODE_ENV;
if (dbEnv === 'test') {
    dbName = process.env.TEST_DB_DBNAME;
} else {
    dbName = process.env.DB_DBNAME;
}
const sequelize = new Sequelize(`${process.env.DB_DIALECT}://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${dbName}`);

// Test de la connexion
sequelize.authenticate().then(function (err) {
    console.log('Connection à la base de données établie avec succés.');
}).catch(function (err) {
    console.log('Impossible de se connecter à la base de données');
});


const modelsPath = path.join(__dirname, '../models');

//Définition des entités (Respecter l'ordre alphabétique)
let db = {};
db.ambulancier = sequelize.import(`${modelsPath}/ambulancier.js`);
db.commune = sequelize.import(`${modelsPath}/commune.js`);
db.demandeTransport = sequelize.import(`${modelsPath}/demandeTransport.js`);
db.departement = sequelize.import(`${modelsPath}/departement.js`);
db.menu = sequelize.import(`${modelsPath}/menu.js`);
db.role = sequelize.import(`${modelsPath}/role.js`);
db.typeReponse = sequelize.import(`${modelsPath}/typeReponse.js`);
db.typeUser = sequelize.import(`${modelsPath}/typeUser.js`);
db.typeVehicule = sequelize.import(`${modelsPath}/typeVehicule.js`);
db.user = sequelize.import('../models/user.js');

//associations
db.user.belongsTo(db.commune, {
    foreignKey: {
        allowNull: false
    }
});
db.user.belongsTo(db.typeUser, {
    foreignKey: {
        allowNull: false
    }
});

db.commune.belongsTo(db.departement, {
    foreignKey: {
        allowNull: false
    }
});

db.demandeTransport.belongsTo(db.user, {
    foreignKey: {
        allowNull: false
    }
});
db.demandeTransport.belongsTo(db.ambulancier, {
    foreignKey: {
        allowNull: false
    }
});
db.demandeTransport.belongsTo(db.typeVehicule, {
    foreignKey: {
        allowNull: false
    }
});
db.demandeTransport.belongsTo(db.typeReponse, {
    foreignKey: {
        allowNull: false
    }
});

db.ambulancier.belongsTo(db.user, {
    foreignKey: {
        allowNull: false
    }
});
db.ambulancier.belongsTo(db.typeVehicule, {
    foreignKey: {
        allowNull: false
    }
});

db.menu.belongsToMany(db.role, { through: 'menuRole' });
db.role.belongsToMany(db.menu, { through: 'menuRole' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
