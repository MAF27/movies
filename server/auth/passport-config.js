module.exports = function() {
	var passport 				= require("passport");
	var passportLocal 	= require('passport-local');
	var passportTwitter = require('passport-twitter');
	var bcrypt 					= require("bcrypt");

	var userService = require("../services/user-service");

	// Email/Password Authentication
	passport.use(new passportLocal.Strategy(function(username, password, next) {
		userService.findUser(username, function(err, user) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return next(null, false, { message: 'No such user.' });
			}
			bcrypt.compare(password, user.password, function(err, same) {
				if (err) {
					return next(err);
				}
				if (!same) {
					return next(null, false, { message: 'Wrong password.' });
				}
				next(null, user);
			});
		});
	}));

	// Twitter Authentication
	passport.use(new passportTwitter.Strategy({
			consumerKey: 'crj0aykPqH3N2Aoqn4Mm90Dcf',
			consumerSecret: 'V8VjaYZPpAwd5ZaRrDMYOM28Gp9xn2jSqA9qHH03B2NgvouVs3',
			callbackURL: 'http://127.0.0.1:3000/users/twitter/callback'
		},
		function(token, tokenSecrect, profile, done) {
			process.nextTick(function() {
				userService.findUser(profile.username, function(err, user) {

					// if there is an error connecting to the database, stop everything and return error
					if (err)
						return done(err);

					// if the user is found then log them in
					if (user) {
						return done(null, user); // user found, return that user
					} else {
						// if there is no user, create them
						var newUser = { // set all of the user data that we need
							'twitter': { id: profile.id },
							'username': profile.username,
							'firstName': profile.displayName,
							'lastName': ' ', // cannot be empty, for validation
							'password': ' '  // cannot be empty, for validation
						};
						// save our user into the database
						userService.addUser(newUser, function(err, user) {
							if (err)
								throw err;
							return done(null, user);
						});
					}
				});

			});

			return (done(null, {
				username: profile.username,
				firstName: profile.displayName
			}));
		}));

	passport.serializeUser(function(user, next) {
		next(null, user.username);
	});

	passport.deserializeUser(function(username, next) {
		userService.findUser(username, function(err, user) {
			next(err, user);
		});
	});
};
