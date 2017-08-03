# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### Organisation des require ###
Organiser les require comme suit:

* core modules
* npm modules
* autres

### Gestion des variables d'environnement ###
* Variables nécessaires à la connexion à la base de données (host, port, user, password, dialect)
* Variables contenant les clés secrètes pour le cryptage des mots de passe avec cryptojs et la création de token avec jwt

La dépendance utilisée pour charger ces différentes variables est dotenv. Pour charger ces différentes variables au moment du lancement de l'application, il faut:
* Créer un fichier nommé **.env** contenant des clés valeurs comme suit (remplacer [VALEUR] par les bonnes valeurs):

DB_HOST=[VALEUR]

DB_PORT=[VALEUR]

DB_DBNAME=[VALEUR]

DB_USER=[VALEUR]

DB_PWD=[VALEUR]

DB_DIALECT=[VALEUR]

SERVER_PORT=[VALEUR]

CRYPTO_SECRETKEY=[VALEUR]

JWT_SECRETKET=[VALEUR]

* Lancer le projet avec la commande npm start
* Pour plus d'information sur cette dépendance: [dotenv npm](https://www.npmjs.com/package/dotenv) ou [dotenv github](https://github.com/motdotla/dotenv)

NB: le fichier **.env** n'est pas commité. Il est spécifique à chaque environnement.