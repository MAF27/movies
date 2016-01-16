var express = require('express');
var router = express.Router();

var Movie = require('../models/movie');

// All routes relative to host/api
router.get('/user', function(req, res) {
	// If we're logged in
	if (req.user) {
		// Return full user object, but without password hash
		var user = {
			_id: req.user._id,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			username: req.user.username
		};
		res.status(200)
			.json(user);
	} else {
		res.status(200)
			.json(null);
	}
});

router.post('/movie', function(req, res) {
	var newMovie = new Movie(req.body);

	newMovie.save(function(err, movie) {
		if (err) {
			res.status(500)
				.json(err);
		}
		res.status(200)
			.json(movie);
	});
});

router.get('/movie', function(req, res) {
	Movie.find({}, function(err, movies) {
		if (err) {
			console.log('API Error getting movies: ', err);
		} else {
			return res.status(200)
				.json(movies);
		}
	});
});

router.put('/movie', function(req, res) {
	Movie.findOne({
		'movie.id': req.body.movie.id
	}, function(err, movie) {
		if (err) {
			console.log('API error finding movie to update: ', err);
		} else {
			movie.status = req.body.status;
			movie.created = req.body.created;
			movie.loaner = req.body.loaner;

			movie.save(function(err) {
				if (err) {
					console.log('API error saving updated movie:', err);
				} else {
					return res.status(200)
						.json(movie);
				}
			});
		}
	});
});

module.exports = router;
