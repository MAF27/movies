var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userService = require('../services/user-service');

var userSchema = new Schema({
   firstName: { type: String, required: 'Please enter your first name.' },
   lastName: { type: String, required: 'Please enter your last name.' },
   username: { type: String, required: 'Please enter a user name.' },
   password: { type: String, required: 'Please enter a password.' },
   city: String,
   state: String,
   twitter: { id: String },
   created: { type: Date, 'default': Date.now }
});

userSchema.path('username').validate(function(value, next){
   userService.findUser(value, function(err, user){
     if (err) {
         console.log(err);
         return next(false);
     }
     next(!user);
   });
}, 'That username is already taken.');

var User = mongoose.model('User', userSchema);

module.exports = User;
