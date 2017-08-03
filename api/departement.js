const path = require('path');
const express = require('express');
const router = express.Router();
// LOG4JS
const log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
const log = log4js.getLogger('api/departement.js');
// Base de données
const db = require(path.join(__dirname, '../dal/db.js'));



const has = Object.prototype.hasOwnProperty;
// GET /departements
// Renvoie tous les départements en fonction du paramétre
router.get('/departements', (req, res) => {
    let query = req.query;
    let where = {};
    if (has.call(query, 'couvert')) {
        if (query.couvert === 'true') {
            where.couvert = true;
        } else {
            where.couvert = false;
        }
        db.departement.findAll({ where: where }).then(function (departements) {
            res.json(departements);
        }, function (error) {
            log.error(`GET /departements: Erreur lors de la récupération des départements. Message d'erreur: ${error}`);
            res.status(500).send();
        });
    } else {
        res.status(400).send('Renseigner le paramétre couvert');
    }
});

module.exports = router;