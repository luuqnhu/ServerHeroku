/**
 * Created by Luu Nhu on 01/07/2017.
 */
var jwt    = require('jsonwebtoken');
var config  = require('../config');
var jwtDecode = require('jwt-decode');
var _       = require('lodash');

module.exports = {
    verifyToken: function verifyToken(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config.secretKey, function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    },
    verifyAdmin: function verifyAdmin(req, res){
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        var decoded = jwtDecode(token);
        if(decoded.Level === "admin")
            return true;
        return false;
    },
    verifyUser: function verifyUser(req, res){
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        var decoded = jwtDecode(token);
        return decoded.Username;
    }
};