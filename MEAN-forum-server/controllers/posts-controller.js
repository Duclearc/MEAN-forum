const fs = require('fs');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    //set up a portion of the data from DB according to the query parameters (if there are any)
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
      postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
  
    //set up original posts array by fetching all the data from DB
    postQuery
      .then((data) => {
        const posts = data;
  
        //send data to frontend
        res.status(200).json({
          posts: posts,
        })
      })
      .catch((err) => console.log(err, 'Posts could not be fetched from DB'))
  }

  exports.getSinglePost = (req, res, next) => { 
    Post.findOne({ _id: req.params.id })
      .then((data) => {
        const targetPost = data;
  
        //send to frontend
        res.status(200).json({
          posts: [targetPost],
        })
      })
      .catch((err) => console.log(err, 'Desired post could not be retrieved'))
  }

  exports.createPost = (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      creator: req.user,
    });
    if (req.file) {
      post.imgPath = `/images/${req.file.filename}`;
    }
  
    //save post to DB
    post.save().then(newPost => {
      res.status(201).json({
        message: 'New post successfully added',
        post: {
          ...post,
          _id: newPost._id
        }
      });
    });
  }

  exports.editPost = (req, res, next) => {
    const editedPost = new Post({
      _id: req.body._id,
      title: req.body.title,
      content: req.body.content,
      imgPath: req.body.imgPath,
      creator: req.user,
    });
    if (req.file) {
      editedPost.imgPath = `/images/${req.file.filename}`;
    }
    Post.replaceOne({ _id: req.body._id, creator: req.user }, editedPost)
      .then(result => {
        // console.log(result);
        if (result.n > 0) {
          res.status(200).json({ message: 'Post successfully edited' });
        } else {
          res.status(401).json({ message: 'User unauthorized to perform this action' });
        }
      });
  }

  exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id, creator: req.user })
      .then(({ imgPath }) => {
        if (imgPath) {
          const filePath = __dirname + '/../images/' + imgPath.split('/images/')[1];
          fs.unlinkSync(filePath);
        }
      });
  
    Post.deleteOne({ _id: req.params.id, creator: req.user })
      .then(result => {
        if (result.n > 0) {
          res.status(200).json({ message: 'Post deletion complete' });
        } else {
          res.status(401).json({ message: 'User unauthorized to perform this action' });
        }
      });
  }