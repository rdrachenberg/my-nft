require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 8080;
const secret = process.env.SECRET;

const config = {
    development: {
        port: port,
        dbURL: process.env.MONGODB_URI,
        authCookieName: 'x-auth-token',
        loggedIn: 'false',
        secret: secret,
    },
    production: {
        port: port,
        dbURL: process.env.MONGODB_URI,
        authCookieName: 'x-auth-token',
        loggedIn: 'false',
        secret: secret,}
};

module.exports = config[env];