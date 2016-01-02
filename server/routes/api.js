var express 			= require('express');
var router 				= express.Router();

var GoingService 	= require('../services/going-service');
var Going 				= require("../models/going");

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
	} else res.status(200)
		.json(null);
});

router.post('/going', function(req, res) {
	var newGoing = new Going({
		rest_id: req.body.rest_id,
		user_id: req.body.user_id,
		user_firstName: req.body.user_firstName,
		user_lastName: req.body.user_lastName
	});

	newGoing.save(function(err, user) {
		if (err) {
			res.status(500)
				.json(err);
		}
		res.status(200)
			.json(user);
	});
});

router.delete('/going', function(req, res) {
	Going.remove({
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
		} else res.status(200)
			.json('OK');
	});
});

router.get('/get-goings/:rest_id', function(req, res) {
	Going.find({
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

// router.get('/yelp/:location', function(req, res) {
// 	var businesses = YelpService(req.params.location, 'bars', function(businesses){
// 		res.status(200).json(businesses);
// 	});
// });

module.exports = router;
