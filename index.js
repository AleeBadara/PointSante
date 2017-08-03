/* Fichier d'entrée de l'application */

// Express
const express = require('express');
//Body Parser
const bodyParser = require('body-parser');
// LOG4JS
const log4js = require('log4js');
log4js.configure('./config/log4js.json');
const log = log4js.getLogger('index.js');
// Base de données
const db = require(__dirname + '/dal/db.js');
// API
const userApi = require('./api/user');
const typeUserApi = require('./api/typeUser');
const departementApi = require('./api/departement');
const demandeTransportApi = require('./api/demandeTransport');
const menuApi = require('./api/menu');
const ambulancierApi = require('./api/ambulancier');


const app = express();
// Logge toutes les requêtes http en utilisant connect-logger
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

// Middleware: transforme tous les body des requêtes en json
app.use(bodyParser.json());

// GET /
// Index
app.get('/', function (req, res) {
    res.send("Welcome to PointSante!");
});

app.use('/', userApi);
app.use('/', typeUserApi);
app.use('/', departementApi);
app.use('/', demandeTransportApi);
app.use('/', menuApi);
app.use('/', ambulancierApi);


db.sequelize.sync().then(function () {
    app.listen(process.env.SERVER_PORT, function () {
        console.log(`App listening at port ${process.env.SERVER_PORT}`);
    });
});

module.exports.app = app;
