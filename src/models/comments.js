//IMPORTS
const mongoose = require('mongoose'); 
const validator = require('validator'); 

//CREATION OF USER SCHEMA MODEL
const commentSchema = new mongoose.Schema({
    //Associate the comment to the user
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    creationdate: {
        type: Date,
        default: Date.now()
    },
});



//EXPORT THE VARIABLE TO USE IN OTHER FILES
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;


