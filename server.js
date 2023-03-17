// *************************************************************************************************
// require statements and initial variable declaration 
// *************************************************************************************************
require('dotenv').config()
const express = require('express');
require('express-async-errors');

const cors = require('cors');

// *************************************************************************************************


const app = require('express')();

const config = require('./backend/config/config');
const dbConnection = require('./backend/config/database');
const path = require('path');

dbConnection().then(() => {
    require('./backend/config/express')(app);
    require('./backend/config/routes')(app);

    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(500).send(err.message);
        console.log('*'.repeat(90));
    });

    if(process.env.NODE_ENV === 'production'){
        app.use(express.static(path.join(__dirname, 'client/build')));
        app.use(express.static(path.join(__dirname, 'client/public')));
        app.use(express.static('client/build'));

         // Handle React routing, return all requests to React app
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
        });
    }

    app.listen(config.port, function () {
    console.log(`🌎  ==> API Server now listening on port ${config.port}!  🌎`);
    });

}).catch(console.error);







// app.use(cors());

// app.get("*", (req, res, next) => {
//     res.sendFile(path.join(__dirname, "client/build/index.html"));
// });
// const bodyParser = require('body-parser');
// const path = require('path');
// const cors = require('cors');

// let port = 8080; 
// // set up Express 
// app.use(express.static(path.join(__dirname, "client/build")));

// // Use body-parser for handling form submissions
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());