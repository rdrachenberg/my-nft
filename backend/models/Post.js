const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Array, Number, Boolean, ObjectId } = Schema.Types;

const postSchema = new Schema({
    
    meta: {

        name: {
            type: String,
            required: true,
        },
        
        description: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        external_url: {
            type: String,
            required: true,
        },

        attributes: {
            type: Array
        },

        
    },

    finalHash: {
        type: String,
        required: true,
    },
    
    chainHash: {
        type: String,
        required: true,
    },

    drip: {
        type: Number,
        require: true,
    },
    
    bnbValue: {
        type: Number,
        require: true,
    },
});

module.exports = new Model('Post', postSchema);