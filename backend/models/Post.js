const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Array, Number, Boolean, ObjectId } = Schema.Types;

const postSchema = new Schema({

  
    meta: {

        name: {
            type: String,
            required: false,
        },
        
        description: {
            type: String,
            required: false,
        },

        image: {
            type: String,
            required: false,
        },

        external_url: {
            type: String,
            required: false,
        },

        attributes: {
            type: Array
        },

        
    },

    finalHash: {
        type: String,
        required: false,
    },
    
    chainHash: {
        type: String,
        required: false,
    },

   

});

module.exports = new Model('Post', postSchema);