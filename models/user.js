/**
 * Retourne l'entité User (hôpital, Société d'ambulance, maison de retraite, ect.)
 */
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');
// LOG4JS
const log4js = require('log4js');
log4js.configure('./config/log4js.json');
const log = log4js.getLogger('models/user.js');

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        siren: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            validate: {
                len: [9, 9]
            }
        },
        denomination: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        adresse: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            validate: {
                len: [8, 30]
            },
            set: function (value) {
                let salt = bcrypt.genSaltSync(10);
                let hashedPassword = bcrypt.hashSync(value, salt);

                //this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        },
        dateValidationMailByUser: {
            type: DataTypes.DATE
        },
        dateValidationAccountByPointSante: {
            type: DataTypes.DATE
        },
        telephone1: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [10, 12]
            }
        },
        telephone2: {
            type: DataTypes.STRING,
            unique: true
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
            hooks: {
                beforeValidate: function (user, options) {
                    if (typeof user.mail === 'string') {
                        user.mail = user.mail.toLowerCase();
                    }
                }
            },
            classMethods: {
                authenticate: function (body) {
                    return new Promise(function (resolve, reject) {
                        if (typeof body.mail !== 'string' || typeof body.password !== 'string') {
                            return reject();
                        }
                        user.findOne({ where: { mail: body.mail } }).then(function (user) {
                            if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                                log.info('authenticate: Utilisateur non trouvé ou mot de passe incorrect.');
                                return reject();
                            }
                            resolve(user);
                        }, function (error) {
                            log.error('authenticate: Erreur lors de la recherche de l\'utilisateur par son mail.' + error);
                            reject();
                        });
                    });
                },
                findByToken: function (token) {
                    return new Promise(function (resolve, reject) {
                        try {
                            let decodedJWT = jwt.verify(token, '123');
                            let bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc');
                            let tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
                            user.findById(tokenData.siren).then(function (user) {
                                if (user) {
                                    resolve(user);
                                } else {
                                    log.info('findByToken: Utilisateur correspondant au siren contenu dans le token non trouvé.');
                                    reject();
                                }
                            }, function (error) {
                                log.error('findByToken: Erreur lors de la recherche de l\'utilisateur par son siren.' + error);
                                reject();
                            });
                        } catch (error) {
                            log.error('findByToken: Erreur lors de la recherche de l\'utilisateur par son sirne.' + error);
                            reject();
                        }
                    });
                }
            },
            instanceMethods: {
                /**
                 * Renvoie les colonnes à envoyer au client
                 */
                getPublicData: function () {
                    let json = this.toJSON();
                    return _.pick(json, 'siren', 'denomination', 'adresse', 'mail', 'telephone1', 'telephone2', 'communeCodeInsee', 'typeUserId');
                },
                /**
                 * Génére un token pour l'utilisateur qui s'est connecté avec succés
                 */
                generateToken: function (type) {
                    if (!_.isString(type)) {
                        return undefined;
                    }
                    try {
                        let stringData = JSON.stringify({ siren: this.get('siren'), type: type });
                        let encryptedData = cryptojs.AES.encrypt(stringData, process.env.CRYPTO_SECRETKEY).toString();
                        let token = jwt.sign({
                            token: encryptedData
                        }, process.env.JWT_SECRETKET);
                        return token;
                    } catch (error) {
                        log.error('generateToken: Erreur lors de la génération du token.' + error);
                        return undefined;
                    }
                }
            }
        });
    return user;
};
