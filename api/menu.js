const path = require('path');
const express = require('express');
const router = express.Router();
// LOG4JS
const log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
const log = log4js.getLogger('api/demandeTransport.js');
// Base de données
const db = require(path.join(__dirname, '../dal/db.js'));
// Middleware
const middleware = require(path.join(__dirname, '../middleware.js'))(db);


const has = Object.prototype.hasOwnProperty;

// GET /menus
// Permet de renvoyer les menus en fonction des roles
router.get('/menus', middleware.requireAuthentication, (req, res) => {
    let query = req.query;
    let where = {};
    if (has.call(query, 'roleId') && query.roleId) {
        where.roles = query.roleId.split(',');
        const attributes = ['libelle', 'url', 'rang'];
        db.menu.findAll({ attributes: attributes, include: [{ model: db.role, attributes: [], where: { id: where.roles } }] }).then(function (menus) {
            res.json(menus);
        }, function (error) {
            log.error(`GET /menus: Erreur lors de la récupération des menus par role (roles: ${where.roles}). Message d'erreur: ${error}`);
            res.status(404).send();
        });
    } else {
        res.status(404).send("Renseigner le paramétre roleId");
    }
});

module.exports = router;