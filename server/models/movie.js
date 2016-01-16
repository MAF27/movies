var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	loaner: {
		_id: { type: String, 'default': null },
		firstName: { type: String, 'default': null },
		lastName: { type: String, 'default': null }
	},
	created: {
		type: Date,
		'default': Date.now
	},
	status: { type: String, 'default': 'with_owner' }
});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
