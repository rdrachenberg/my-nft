const mongoose = require('mongoose');
const config = require('./config');

module.exports = () => {
    console.log('🍍🍍 mongoose started the mongo ! 🍍🍍');
    console.log('🍍🍍 ready to rock! 🍍🍍')
    // console.log(config.dbURL);
    return mongoose.connect(config.dbURL, {});
}