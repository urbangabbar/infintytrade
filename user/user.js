const jwt = require('jsonwebtoken');
const atob = require('atob');
const key = require('../sql/key');
const bcrypt = require('bcrypt');
const connection = require('../sql/connection');
const saltRounds = 10;

module.exports.signup = async function(req, res) {
    var fname = req.body.first_name;
    var lname = req.body.last_name;
    var pass = req.body.password;
    var email = req.body.email;
    var emailExists = await checkifEmailExists(email);
    if (emailExists.length) {
        console.log(emailExists);
        res.status(401).send('User already exists');
    } else {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(pass, salt, function(err, hash) {
                var sql = "INSERT INTO `login`(`first_name`,`last_name`,`email`,`password`) VALUES ('" + fname + "','" + lname + "','" + email + "','" + hash + "')";
                var query = connection.query(sql, function(err, result) {
                    res.end(JSON.stringify(result));
                });
            });
        });
    }
};

module.exports.signin = function(req, res) {
    var email = req.body.email;
    var pass = req.body.password;
    var dec_pass = atob(pass);
    var sql = "SELECT id, first_name, last_name, email, password FROM `login` WHERE `email`='" + email + "'";
    connection.query(sql, function(err, results) {
        if (results != "") {
            var data = JSON.stringify(results);
            var secret = key.tokenKey;
            console.log(results[0].password);
            bcrypt.compare(pass, results[0].password, function(err, result) {
                if (result) {
                    var now = Math.floor(Date.now() / 1000),
                        iat = (now - 10),
                        expiresIn = 3600,
                        jwtId = Math.random().toString(36).substring(7);
                    var payload = {
                        iat: iat,
                        jwtid: jwtId,
                        audience: 'CONSUMER',
                        data: data
                    };
                    jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: expiresIn }, function(err, token) {

                        if (err) {
                            console.log('Error occurred while generating token');
                            console.log(err);
                            return false;
                        } else {
                            if (token != false) {
                                //res.send(token);
                                res.header();
                                res.json({
                                    "results": { "status": "true" },
                                    "token": token,
                                    "data": results
                                });
                                res.end();
                            } else {
                                res.send("Could not create token");
                                res.end();
                            }
                        }
                    });
                } else {
                    res.status(401).send('Wrong password');
                }
            });
        } else if (results == "") {
            res.status(404).send('User not found');
        }
    });
};

module.exports.checkUser = function(req, res, next) {
    if ((req._parsedUrl.pathname).startsWith("/api/user")) {
        next();
    } else {
        jwt.verify(req.get('bearer'), key.tokenKey, function(err, decoded) {
            if (!err) {
                next();
            } else {
                res.status(401).send("Session Token not present");
            }
        });
    }
}

function checkifEmailExists(email) {
    console.log('email aya');
    return new Promise(function(resolve, reject) {
        var checkEmailSql = "SELECT id FROM `login` WHERE `email`='" + email + "'";
        console.log(checkEmailSql);
        connection.query(checkEmailSql, (error, results) => {
            if (error) {
                throw error;
            }
            resolve(results);
        });
    });
}