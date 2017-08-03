const path = require('path');
const express = require('express');
const router = express.Router();
// LOG4JS
const log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
const log = log4js.getLogger('api/typeUser.js');
// Base de données
const db = require(path.join(__dirname, '../dal/db.js'));



// GET /typeUsers
// Permet de renvoyer tous les types d'utilisateur
router.get('/typeUsers', (req, res) => {
    db.typeUser.findAll().then(function (typeUsers) {
        res.json(typeUsers);
    }, function (error) {
        log.error(`GET /typeUsers: Erreur lors de la récupération des types d'utilisateur. Message d'erreur: ${error}`);
        res.status(500).send();
    });
});

module.exports = router;