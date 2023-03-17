const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const secret = require('./config').secret;
const authCookieName = require('./config').authCookieName;
const express = require('express');
const path = require('path');


module.exports = (app) => {
    const corsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200
    };

    app.use(cors(corsOptions));
    app.disable('x-powered-by');

    app.use(function(req, res, next, err) {
        // Website to allow to connect  || 'http://localhost:3000' 'https://ryan-react-app.herokuapp.com' || 
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        // True if the website needs to include cookies in the requests sent
        // to the API (e.g. in case of sessions use)
        res.setHeader('Access-Control-Allow-Credentials', true);
        // Pass to next layer of middleware
        next();
    });

    app.use(express.static(path.join(__dirname, 'client/build')));
    app.use(express.static(path.join(__dirname, 'client/public')));
    console.log(authCookieName); // will use later for successful login and name cookie. 

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    
    app.use(cookieParser(secret));
};
