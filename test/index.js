const request = require('supertest');
const expect = require('expect');

const db = require(__dirname + './../dal/db.js');
const seedData = require('./seedData');
const app = require('./../index').app;

describe('Index', () => {
    describe('GET /', () => {
        it('should return Welcome to PointSante! response', (done) => {
            request(app)
                .get('/')
                .expect(200)
                .expect('Welcome to PointSante!')
                .end(done);
        });
    });
});

beforeEach(seedData.populateUser);

let testUser = {
    siren: "999999999",
    denomination: "Hôpital 3",
    adresse: "Test 3",
    mail: "h3@gmail.com",
    password: "userTestPassword",
    telephone1: "0650915478",
    communeCodeInsee: "92800",
    typeUserId: "1"
};

describe('api/user.js', () => {

    //Create user
    describe('POST /users', () => {
        it('should create a new user', (done) => {
            request(app)
                .post('/users')
                .send(testUser)
                .expect(200)
                .expect((res) => {
                    expect(res.body.siren).toBe(testUser.siren);
                })
                .end((err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        db.user.findById(testUser.siren).then(function (user) {
                            expect(user.siren).toBe(testUser.siren);
                            done();
                        }).catch((e) => done(e));
                    }
                });
        });
    });

    // Login user
    describe('POST /users/login', () => {
        it('should login a user and return a token', (done) => {
            request(app)
                .post('/users/login')
                //.set('x-auth', seedData.seedUsers[0].token)
                .send({ mail: seedData.seedUsers[0].mail, password: seedData.seedUsers[0].password })
                .expect(200)
                .expect((res) => {
                    expect(res.body.siren).toBe(seedData.seedUsers[0].siren);
                })
                .end(done);
        });
    });

    // Update user
    let newAdresse = 'new Adresse';
    describe('PUT /users/:siren', () => {
        it('should update a user', (done) => {
            seedData.seedUsers[0].adresse = newAdresse;
            request(app)
                .put(`/users/${seedData.seedUsers[0].siren}`)
                .set('x-auth', seedData.seedUsers[0].token)
                .send({ adresse: newAdresse })
                .expect(200)
                .expect((res) => {
                    expect(res.body.adresse).toBe(newAdresse);
                })
                .end(done);
        });
    });

    // Update user with fake token
    describe('PUT /users/:siren', () => {
        it('should not update a user and return 401 if fake token is given', (done) => {
            seedData.seedUsers[1].adresse = newAdresse;
            request(app)
                .put(`/users/${seedData.seedUsers[1].siren}`)
                .set('x-auth', "fakeToken")
                .send({ adresse: newAdresse })
                .expect(401)
                .end(done);
        });
    });

});

let testAmbulancier = {
    mail: "a@b.fr",
    nom: "ABM",
    prenom: "ABM",
    imei: "111111111111111",
    userSiren: "333333333",
    typeVehiculeId: 1
};

/*describe('api/ambulancier.js', () => {

    //Create ambulancier
    describe('POST /ambulanciers', () => {
        it('should create a new ambulancier', (done) => {
            request(app)
                .post('/ambulanciers')
                .send(testAmbulancier)
                .expect(200)
                .expect((err, res) => {
                    console.log(err);
                    expect(res.body.imei).toBe(testAmbulancier.imei);
                })
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                        done(err);
                    } else {
                        db.user.findById(testAmbulancier.mail).then(function (ambulancier) {
                            expect(ambulancier.prenom).toBe(testAmbulancier.testAmbulancier.prenom);
                            done();
                        }).catch((e) => done(e));
                    }
                });
        });
    });

});








/*
it('should update a user', (done) => {
    let newAdresse = 'Changement adresse';
    testUser.adresse = newAdresse;
    request(app)
        .put('/users/:siren')
        .send(testUser)
        .expect(200)
        .expect((res) => {
            expect(res.body.adresse).toBe(newAdresse);
        })
        .end((err, res) > {
            if(err) {
                return done(err);
            }
        });
});

*/




