const jwt = require('jsonwebtoken');
const User = require('../model/User');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader); // Bearer token
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async(err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = await User.findOne({email:decoded.email}).exec();
            console.log("in verify JWT",req.user)
            next();
        }
    );
}

module.exports = verifyJWT