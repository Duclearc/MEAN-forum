const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const verifyAuth = require('../middleware/auth-verification');
const extractFile = require('../middleware/file-extraction');
const Controller = require('../controllers/posts-controller');

//setting up file uploads

//setting up paths:

//* sends posts to frontend
router.get('', Controller.getPosts);

//* sends single post to frontend
router.get('/:id', Controller.getSinglePost) //MUST ADD PROTECTION HERE!!

//* create new post
router.use(bodyParser.json()); //parse JSON data
router.post('', verifyAuth, extractFile, Controller.createPost);

//* edits posts
router.patch('/:id', verifyAuth, extractFile, Controller.editPost);

//* deletes posts
router.delete('/:id', verifyAuth, Controller.deletePost);

module.exports = router;