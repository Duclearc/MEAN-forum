const jwt = require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/../.env' });

module.exports = (req, res, next) => {
    try {
        //isolate token from 'Bearer tokenStringGoesHere' string format
        const token = req.headers.authorization.split(' ')[1];
        const { email, userId } = jwt.verify(token, process.env.TOKEN_STRING);
        req.user = userId;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: 'Auth failed: verification middleware error',
            error: error
        });
    }
};