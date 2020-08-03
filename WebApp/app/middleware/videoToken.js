let jwt = require('jsonwebtoken');
const config = require('./../config');

let checkvideoToken = (req, res, next) => {
    let token = req.query.token; // Express headers are auto converted to lowercase
    if(token == null){
        return res.json({
            success: false,
            message: 'Auth token is not supplied//NULL',
        });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    else{
        return res.json({
            success: false,
            message: 'Auth token is not supplied//Not Bearer passed',
        });
    }

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied',
        });
    }
};

module.exports = {
    checkvideoToken: checkvideoToken
}