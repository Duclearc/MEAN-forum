const mongoose = require('mongoose');

//create schema
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imgPath: { type: String, required: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //references an object from the User schema
});

//export model ('Post') off of that schema
module.exports = mongoose.model('Post', postSchema);