const mongoose = require('mongoose');
const config = require('./config');

module.exports = () => {
    console.log('🍍🍍 mongoose started the mongo ! 🍍🍍');
    return mongoose.connect(config.dbURL, {});
}