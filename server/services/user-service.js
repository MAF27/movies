var User = require('../models/user');
var bcrypt = require('bcrypt');

exports.addUser = function(user, next) {
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }

    var newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: hash,
      twitter: { id: user.twitter ? user.twitter.id : null }
    });

    newUser.save(function(err, user) {
      if (err) {
        return next(err, null);
      }
      next(null, user);
    });
  });
};

exports.updateUser = function(user, next) {
  console.log('* UPDATE USER: ', user);
  //   var newUser = new User({
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     username: user.username,
  //     password: hash,
  //     twitter: { id: user.twitter ? user.twitter.id : null }
  //   });
  //
  //   newUser.save(function(err, user) {
  //     if (err) {
  //       return next(err, null);
  //     }
  //     next(null, user);
  //   });
  // });
};

exports.findUser = function(username, next) {
  User.findOne({
    username: username
  }, function(err, user) {
    next(err, user);
  });
};
