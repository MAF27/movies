var Movie = require('../models/movie');

exports.addMovie = function(movie, user, next) {
	var newMovie = new Movie({
		movie: movie,
		user: user
	});

	newMovie.save(function(err) {
		if (err) {
			return next(err);
		}
		next(null);
	});
};

exports.getMovies = function(next) {
	Movie.find({}, function(err, movies) {
		next(err, movies);
	});
};
