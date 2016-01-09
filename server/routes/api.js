var express = require('express');
var router = express.Router();

// var MovieService = require('../services/movie-service');
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

router.delete('/movie', function(req, res) {
	Movie.remove({
		$and: [
			{
				rest_id: req.query.rest_id
			},
			{
				user_id: req.query.user_id
			}]
	}, function(err) {
		if (err) {
			res.status(500)
				.json(err);
		} else {
			res.status(200)
				.json('OK');
		}
	});
});

router.get('/movie', function(req, res) {
	Movie.find({
		rest_id: req.params.rest_id
	}, function(err, goings) {
		if (err) {
			console.log('Error /api/get-goings: ', err);
		} else {
			return res.status(200)
				.json(goings);
		}
	});
});

module.exports = router;
