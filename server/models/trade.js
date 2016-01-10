var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tradeSchema = new Schema({
	owner: {
		_id: String,
		firstName: String
	},
	loaner: {
		_id: String,
		firstName: String
	},
	movie: {
		_id: String,
		title: String,
		poster_path: String
	},
	created: {
		type: Date,
		'default': Date.now
	}
});

var Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
