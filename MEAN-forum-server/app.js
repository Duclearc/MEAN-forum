const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRoutes =  require('./routes/users');
const postsRoutes = require('./routes/posts');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({path: __dirname + '/../.env'});

//setup
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@duclearc-db.cukqa.mongodb.net/${dbName}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('DB successfully connected');
    })
    .catch((err) => {
        console.log(err, 'DB connection failled');
    });

//required to upload images
app.use(bodyParser.urlencoded({ extended: true }));

//required to load images
app.use("/images", express.static(path.join("images")));

//fixing CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Allows headers from all sources to access.
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); //Allows for defaults plus the extra headers specified.
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS'); //Specifies which 'http verbs' are accepted.
    next(); //if all above criteria has been met, continue...
});

//post-related routes
app.use('/api/posts', postsRoutes);
//user-related routes
app.use('/api/users', usersRoutes);

//exports the express app, making it's contents available for usage on other files (in this case, by the server)
module.exports = app;