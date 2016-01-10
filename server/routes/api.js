var express = require('express');
var router = express.Router();

var Movie = require('../models/movie');
var Trade = require('../models/trade');

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

router.post('/trade', function(req, res) {
	var newTrade = new Trade(req.body);

	newTrade.save(function(err, trade) {
		if (err) {
			res.status(500)
				.json(err);
		}
		res.status(200)
			.json(trade);
	});
});

router.put('/trade', function(req, res) {
	console.log('* PUT TRADE: ', req.body._id, req.body.status);
	Trade.update({
		_id: req.body._id
	}, {
		$set: {
			status: req.body.status
		}
	}, function(err) {
		if (err) {
			res.status(500)
				.json(err);
		}
		res.status(200)
			.json(Trade);
	});
});

router.get('/trade', function(req, res) {
	Trade.find({}, function(err, movies) {
		if (err) {
			console.log('API Error getting trades: ', err);
		} else {
			return res.status(200)
				.json(movies);
		}
	});
});


router.get('/movie/:id', function(req, res) {
	// Movie.find({
	// 	rest_id: req.params.rest_id
	// }, function(err, goings) {
	// 	if (err) {
	// 		console.log('Error /api/get-goings: ', err);
	// 	} else {
	// 		return res.status(200)
	// 			.json(goings);
	// 	}
	// });
});

module.exports = router;
