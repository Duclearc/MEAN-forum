const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                imgPath: req.body.imgPath,
            });
            if (req.file) {
                user.imgPath = `/images/${req.file.filename}`;
            }

            //save user to DB
            user.save()
                .then(newUser => {
                    res.status(201).json({
                        message: 'user ' + newUser.username + ' successfully added',
                        user: newUser,
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'ERROR: no user created',
                        error: err,
                    })
                })

        })
        .catch(err => {
            res.status(500).json({
                message: 'ERROR: no hash created from bcrypt',
                error: err,
            })
        })
}

exports.loginUser = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(401).json({
                    message: 'Auth failed. No user found with this email'
                });
            }
            //check if the password is correct
            bcrypt.compare(req.body.password, user.password)
                .then(authStatus => {
                    if (!authStatus) {
                        return res.status(401).json({
                            message: 'Auth failed: wrong password',
                            token: null
                        });
                    }
                    const token = jwt.sign(
                        { email: user.email, userId: user._id, username: user.username },
                        process.env.TOKEN_STRING,
                        {expiresIn: '1h'}
                    );
                    if(token) {
                        return res.status(200).json({
                            message: 'Correct Password. Token has been generated',
                            token: token,
                            userId: user._id,
                        });
                    }
                });
        });
}

exports.getUser = (req, res, next) => {
    User.findOne({ _id: req.user })
    .then(user => {
        userData = {
            id: user._id,
            username: user.username,
            imgPath: user.imgPath || null,
        }
        res.status(200).json({
            user: userData,
        });
    })
}