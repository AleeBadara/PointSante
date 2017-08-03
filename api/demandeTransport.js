const path = require('path');
const express = require('express');
const router = express.Router();
// Underscore
const _ = require('underscore');
// Base de données
const db = require(path.join(__dirname, '../dal/db.js'));
// Middleware
const middleware = require(path.join(__dirname, '../middleware.js'))(db);
// LOG4JS
const log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
const log = log4js.getLogger('api/demandeTransport.js');

const has = Object.prototype.hasOwnProperty;

// POST /demandeTransports
// Permet de créer une demande de transport
router.post('/demandeTransports', middleware.requireAuthentication, (req, res) => {
    let body = _.pick(req.body, 'dateDemande', 'lieuDepart', 'lieuArrivee', 'dateService', 'description');
    db.demandeTransport.create(body).then(function (dmTransport) {
        res.json(dmTransport);
    }, function (error) {
        log.error(`POST /demandeTransports: Erreur lors de la création d'une demande de transport. Message d'erreur: ${error}`);
        res.status(400).send();
    });
});

// GET /demandeTransports
// Permet de récupérer les demandes de transport
router.get('/demandeTransports', middleware.requireAuthentication, (req, res) => {
    let query = req.query;
    let where = {};
    if (has.call(query, 'siren') && query.siren) {
        where.userSiren = query.siren;
        db.demandeTransport.findAll({ where: { userSiren: where.userSiren } }).then(function (demandeTransports) {
            res.json(demandeTransports);
        }, function (error) {
            log.error(`GET /demandeTransports: Erreur lors de la récupération des demandes de transport de l'utilisateur ${where.userSiren}. Message d'erreur: ${error}`);
            res.status(404).send();
        });
    }
    else {
        db.demandeTransport.findAll().then(function (demandeTransports) {
            res.json(demandeTransports);
        }, function (error) {
            log.error(`GET /demandeTransports: Erreur lors de la récupération de tous les demandes de transport. Message d'erreur: ${error}`);
            res.status(500).send();
        });
    }
});

module.exports = router;