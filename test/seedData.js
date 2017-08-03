const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');
const db = require(__dirname + './../dal/db.js');

let userOnesiren = "111111111";
let stringData = JSON.stringify({ siren: userOnesiren, type: 'authentication' });
let encryptedData = cryptojs.AES.encrypt(stringData, process.env.CRYPTO_SECRETKEY).toString();

let seedUsers = [{
    siren: userOnesiren,
    denomination: "Hôpital 1",
    adresse: "Test 1",
    mail: "h1@gmail.com",
    password: "userOnePassword",
    telephone1: "0650915474",
    communeCodeInsee: "92800",
    typeUserId: "1",
    token: jwt.sign({
        token: encryptedData
    }, process.env.JWT_SECRETKET)
},
{
    siren: "222222222",
    denomination: "Hôpital 2",
    adresse: "Test 2",
    mail: "h2@gmail.com",
    password: "userTwoPassword",
    telephone1: "0650915475",
    communeCodeInsee: "92800",
    typeUserId: "1"
},
{
    siren: "333333333",
    denomination: "Société Ambulance ABM",
    adresse: "Test 3",
    mail: "sa@gmail.com",
    password: "userThreePassword",
    telephone1: "0650915479",
    communeCodeInsee: "92800",
    typeUserId: "2"
}];

let seedTypeUser = [
    {
        id: 1,
        libelle: 'Hôpital'
    },
    {
        id: 2,
        libelle: 'Société d\'ambulance'
    }
];

let seedTypeVehicule = [
    {
        id: 1,
        libelle: 'Ambulance'
    },
    {
        id: 2,
        libelle: 'VSL'
    }
];


const populateUser = (done) => {
    db.user.destroy({ where: {} }).then(function () {
        seedUsers.forEach(function (element) {
            db.user.create(element);
        }, this);

    }).then(() => {
        done();
    });
};

module.exports = { seedUsers, populateUser };