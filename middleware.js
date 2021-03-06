/**
 * Middleware utilisé pour protéger certains services (vérification du token de l'utilisateur)
 */
module.exports = function (db) {
    return {
        requireAuthentication: function (req, res, next) {
            let token = req.get('x-auth');
            db.user.findByToken(token).then(function (user) {
                req.user = user;
                next();
            }, function (error) {
                res.status(401).send();
            });
        }
    };
};