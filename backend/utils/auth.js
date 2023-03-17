const jwt = require('./jwt');
const config = require('../config/config');
const models = require('../models');
const Cookies = require('universal-cookie');

module.exports = (redirectAuthenticated = true) => {
    
    return function (req, res, next) {
        const cookies = new Cookies(req.headers.cookie);
        console.log(cookies.get('x-auth-token'));
        const token = req.cookie[config.authCookieName] || '';
        console.log(req.cookie[config.authCookieName]);
        
            jwt.verifyToken(token),
            models.TokenBlacklist.findOne({ token })
        
            .then((data, blacklistToken) => {
                if (blacklistToken) { 
                    return Promise.reject(new Error('blacklisted token')) 
                } else {
                    models.User.findById(data.id)
                    .then((user) => {
                        console.log(user);
                        req.user = user;
                        next();
                    });
                }
            })
            .catch(err => {
                if (!redirectAuthenticated) { next(); return; }

                if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
                    res.status(401).send('UNAUTHORIZED!');
                    return;
                }

                next(err);
            })
    }

};