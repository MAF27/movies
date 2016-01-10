var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var userService = require('../services/going-service');

var movieSchema = new Schema({
	movie: {
		id: String,
		title: String,
		release_date: String,
		overview: String,
		poster_path: String
	},
	owner: {
		_id: String,
		firstName: String,
		lastName: String,
		username: String
	},
	created: {
		type: Date,
		'default': Date.now
	},
	status: String
});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
