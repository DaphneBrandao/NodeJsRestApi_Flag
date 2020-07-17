//IMPORTS
const mongoose = require('mongoose'); 
const validator = require('validator'); 
const bcrypt = require ('bcryptjs');

//CREATION OF USER SCHEMA MODEL
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true 
    },

    username: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true, 
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }
    },

    password: {
        type: String,
        required: true,
        select: false //when we look for users on db, the password will not appear
      
    },

    //saving token
    passwordResetToken: {
        type: String,
        select: false
    },

    passwordResetExpires: {
        type: Date,
        select: false
    },


    creationdate: {
        type: Date,
        default: Date.now()
    },
});

//HASH OF THE PASSWORD BEFORE SAVING 
userSchema.pre('save', async function (next) {
    /*this  - refers to the object is beeing saved on the db - the user
    10 refres to the number of round it will be encrypted - 10 is a recomended number*/
    const hash = await bcrypt.hash(this.password, 10);
    
    //whe a user is created the password will be hash
    this.password = hash;

    next();
});

//EXPORT THE VARIABLE TO USE IN OTHER FILES
const User = mongoose.model('User', userSchema);
module.exports = User;


