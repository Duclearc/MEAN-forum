const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const verifyAuth = require('../middleware/auth-verification');
const extractFile = require('../middleware/file-extraction');
const Controller = require('../controllers/users-controller');

//setting up paths:

//* register new user
router.use(bodyParser.json()); //parse JSON data
router.post('/register', extractFile, Controller.registerUser);

//* login existing user
router.post('/login', Controller.loginUser);

//* get current user
router.get('/me', verifyAuth, Controller.getUser);

module.exports = router;