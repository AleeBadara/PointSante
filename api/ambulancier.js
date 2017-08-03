const path = require('path');
const express = require('express');
const router = express.Router();
// LOG4JS
const log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
const log = log4js.getLogger('api/ambulancier.js');
// Base de données
const db = require(path.join(__dirname, '../dal/db.js'));
// Middleware
const middleware = require(path.join(__dirname, '../middleware.js'))(db);

const has = Object.prototype.hasOwnProperty;

// POST /ambulanciers
// Permet de créer un ambulancier
router.post('/ambulanciers', (req, res) => {
    let body = _.pick(req.body, 'mail', 'nom', 'prenom', 'imei', 'userSiren', 'typeVehiculeId');
    db.ambulancier.create(body).then(function (ambulancier) {
        res.json(ambulancier);
    }, function (error) {
        log.error(`POST /ambulanciers: Erreur lors de la création d'un ambulancier. Message d'erreur: ${error}`);
        res.status(404).send();
    });
});

//PUT /ambulanciers/:mail
// Permet de mettre à jour un ambulancier
router.put('/ambulanciers/:mail', middleware.requireAuthentication, (req, res) => {
    let mail = req.params.mail;
    let body = _.pick(req.body, 'latitude', 'longitude', 'disponible', 'typeVehiculeId');
    let attributes = {};
    if (has.call(req.body, 'latitude')) {
        attributes.latitude = body.latitude;
    }
    if (has.call(req.body, 'longitude')) {
        attributes.longitude = body.longitude;
    }
    if (has.call(req.body, 'disponible')) {
        attributes.disponible = body.disponible;
    }
    if (has.call(req.body, 'typeVehiculeId')) {
        attributes.typeVehiculeId = body.typeVehiculeId;
    }
    db.ambulancier.findById(mail).then(function (ambulancier) {
        if (ambulancier) {
            ambulancier.update(attributes).then(function (ambulancier) {
                res.json(ambulancier);
            }, function (error) {
                log.error(`PUT /ambulanciers/:mail: Erreur lors de la mise à jour des informations de l'ambulancier ${mail}. Message d'erreur: ${error}`);
                res.status(400).send();
            });
        } else {
            res.status(404).send();
        }
    }, function (error) {
        log.error(`PUT /ambulanciers/:mail: Erreur lors de la récupération d'un ambulancier par mail ${mail}. Message d'erreur: ${error}`);
        res.status(404).send();
    });
});

// GET /ambulanciers
// Permet de renvoyer tous les ambulanciers d'une société
router.get('/ambulanciers', middleware.requireAuthentication, (req, res) => {
    let query = req.query;
    let where = {};
    if (has.call(query, 'userSiren') && query.userSiren) {
        where.userSiren = query.userSiren;
        db.ambulancier.findAll({ where: where }).then(function (ambulanciers) {
            res.json(ambulanciers);
        }, function (error) {
            log.error(`GET /ambulanciers: Erreur lors de la récupération des ambulanciers de la société ${where.userSiren}. Message d'erreur: ${error}`);
            res.status(500).send();
        });
    } else {
        res.status(404).send();
    }
});

module.exports = router;