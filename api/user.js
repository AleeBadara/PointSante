const path = require('path');
const express = require('express');
const router = express.Router();
// LOG4JS
const log4js = require('log4js');
log4js.configure(path.join(__dirname, '../config/log4js.json'));
const log = log4js.getLogger('api/user.js');
// Underscore
const _ = require('underscore');
// Base de données
const db = require(path.join(__dirname, '../dal/db.js'));
// Middleware
const middleware = require(path.join(__dirname, '../middleware.js'))(db);


// POST /users/login
router.post('/users/login', (req, res) => {
    let body = _.pick(req.body, 'mail', 'password');
    db.user.authenticate(body).then(function (user) {
        let token = user.generateToken('authentication');
        if (token) {
            res.header('x-auth', token).json(user.getPublicData());
        } else {
            res.status(401).send();
        }
    }, function (error) {
        log.error(`POST /users/login: Erreur lors de l'authentification de l'utilisateur. Message d'erreur: ${error}`);
        res.status(401).send();
    });
});

// POST /users
// Permet de créer un utilisateur (hopital, société d'ambulance, etc)
router.post('/users', (req, res) => {
    let body = _.pick(req.body, 'siren', 'denomination', 'adresse', 'mail', 'password', 'telephone1', 'telephone2', 'communeCodeInsee', 'typeUserId');
    db.user.create(body).then(function (user) {
        res.json(user.getPublicData());
    }, function (error) {
        log.error(`POST /users: Erreur lors de la création de l'utilisateur. Message d'erreur: ${error}`);
        res.status(400).json(error);
    });
});

const has = Object.prototype.hasOwnProperty;

// PUT /users/:siren
// Permet de mettre à jour un utilisateur
router.put('/users/:siren', middleware.requireAuthentication, (req, res) => {
    let userSiren = req.params.siren;
    let body = _.pick(req.body, 'denomination', 'adresse', 'mail', 'password', 'telephone1', 'telephone2', 'communeCodeInsee');
    let attributes = {};
    if (has.call(body, 'denomination')) {
        attributes.denomination = body.denomination;
    }
    if (has.call(body, 'adresse')) {
        attributes.adresse = body.adresse;
    }
    if (has.call(body, 'mail')) {
        attributes.mail = body.mail;
    }
    if (has.call(body, 'password')) {
        attributes.password = body.password;
    }
    if (has.call(body, 'telephone1')) {
        attributes.telephone1 = body.telephone1;
    }
    if (has.call(body, 'telephone2')) {
        attributes.telephone2 = body.telephone2;
    }
    if (has.call(body, 'communeCodeInsee')) {
        attributes.communeCodeInsee = body.communeCodeInsee;
    }
    db.user.findById(userSiren).then(function (user) {
        if (user) {
            user.update(attributes).then(function (user) {
                res.json(user.toJSON());
            }, function (error) {
                log.error(`PUT /users/:siren: Erreur lors de la mise à jour des informations de l'utilisateur avec le ${userSiren}. Message d'erreur: ${error}`);
                res.status(400).send();
            });
        } else {
            log.info(`PUT /users/:siren: Utilisateur avec le siren ${userSiren} non trouvé`);
            return res.status(404).send('Utilisateur non trouvé');
        }
    }, function (error) {
        log.error(`PUT /users/:siren: Erreur lors de la recherche de l'utilisateur avec le ${userSiren}. Message d'erreur: ${error}`);
        res.status(500).send();
    });
});

module.exports = router;