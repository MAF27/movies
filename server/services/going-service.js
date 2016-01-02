var Going = require("../models/going");

exports.addGoing = function(rest_id, username, next) {
	var newGoing = new Going({
		rest_id: rest_id,
		username: username
	});

	newGoing.save(function(err) {
		if (err) {
			return next(err);
		}
		next(null);
	});
};

exports.getGoings = function(rest_id, next) {
	Going.find({
		rest_id: rest_id
	}, function(err, goings) {
		next(err, goings);
	});
};
