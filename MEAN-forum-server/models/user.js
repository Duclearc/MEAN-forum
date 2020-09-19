const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//create schema
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imgPath: { type: String, required: false }
});

userSchema.plugin(uniqueValidator);

//export model ('User') off of that schema
module.exports = mongoose.model('User', userSchema);