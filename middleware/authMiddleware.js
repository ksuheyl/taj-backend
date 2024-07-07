var jwt = require("jsonwebtoken");
var User = require("../models/user.js");

var checkUser = function (req, res, next) {
  var token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        User.findByPk(decodedToken.userId)
          .then(function (user) {
            res.locals.user = user;
            next();
          })
          .catch(function (err) {
            res.locals.user = null;
            next();
          });
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

var authenticateToken = function (req, res, next) {
  var token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err) {
      if (err) {
        res.send("login");
      } else {
        next();
      }
    });
  } else {
    res.send("login");
  }
};

module.exports = { checkUser: checkUser, authenticateToken: authenticateToken };
