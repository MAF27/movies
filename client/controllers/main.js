var angular = require('angular');
var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('CtrlAllMovies', function($http, $scope, $rootScope) {
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	if (!$scope.movies) {
		$http.get('/api/movie')
			.then(function(result) {
				$scope.movies = result.data;
			});
	}

	$scope.addRequest = function(movie, idx) {
		// If own movie
		if (movie.owner._id === $rootScope.userobj._id) {
			$scope.msg = 'You own the title ' + movie.movie.title + ' yourself ...';
		} else if (movie.status === 'on_loan') {
			if (movie.loaner._id === $rootScope.userobj._id) {
				$scope.msg = 'You\'ve already borrowed the movie "' + movie.movie.title + '".';
			} else {
				$scope.msg = 'The movie "' + movie.movie.title + '" is on loan to ' + movie.loaner.firstName + '. Please check back later.';
			}
		} else if (movie.status === 'request') {
			if (movie.loaner._id === $rootScope.userobj._id) {
				$scope.msg = 'You\'ve already requested the movie "' + movie.movie.title + '".';
			} else {
				$scope.msg = 'The movie "' + movie.movie.title + '" has already been requested by ' + movie.loaner.firstName + '. Please check back later.';
			}
		} else {
			// Save loan request
			var body = {
				loaner: {
					_id: $rootScope.userobj._id,
					firstName: $rootScope.userobj.firstName,
					lastName: $rootScope.userobj.lastName
				},
				movie: {
					id: movie.movie.id
				},
				status: 'request',
				created: new Date()
			};
			return $http.put('/api/movie', body)
				.then(function(result) {
					console.log('* Result of addtrade: ', result);
					$scope.msg = 'A request to loan "' + result.data.movie.title + '" was sent to ' + result.data.owner.firstName + '. You\'ll hear back shortly.';
					// Check updated movie back into scope
					for (var i = 0; i < $scope.movies.length; i++) {
						if ($scope.movies[i].movie.id === result.data.movie.id) {
							$scope.movies[i] = result.data;
						}
					}
				});
		}
	};

	$scope.hide_msg = function() {
		$scope.msg = '';
	};

});

movieControllers.controller('CtrlAddMovie', function($http, $scope, $rootScope, $location) {
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	$scope.search = function(search) {
		var s = search.replace(' ', '+');
		$http.jsonp('http://api.themoviedb.org/3/search/movie?query=' + s +
				'&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8&callback=JSON_CALLBACK')
			.then(function(res) {
				$scope.movies = res.data.results;
				$scope.searchfield = '';
			})
			.catch(function(err) {
				console.log('An error occurred: ', err);
			});
	};

	$scope.saveMovie = function(movie) {
		var body = {
			movie: movie,
			owner: $rootScope.userobj
		};
		return $http.post('/api/movie/', body)
			.then(function(result) {
				$scope.added_movie = body.movie;
			});
	};

	$scope.hide_added_movie = function() {
		$scope.added_movie = '';
	};

	$scope.filternull = function(item) {
		return item.poster_path !== null;
	};

	$scope.back = function() {
		$location.path('/allmovies');
	};

});

movieControllers.controller('CtrlMyMovies', function($http, $scope, $rootScope) {
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	// var fillMyMovies = function() {
	// 	$scope.myMovies = [];
	// 	var i, status, j, loaner;
	//
	// 	$http.get('/api/movie')
	// 		.then(function(result) {
	//
	// 			$scope.movies = result.data;
	//
	// 			// for (i = 0; i < $scope.movies.length; i++) {
	// 			// 	if ($scope.movies[i].status === 'on_loan') {
	// 			// 		// Check whether this movie is on loan
	// 			// 		status = 'mine'; loaner = '';
	// 			// 		for (j = 0; j < result.data.length; j++) {
	// 			// 			if (result.data[j].movie._id === $scope.movies[i].movie.id && result.data[j]
	// 			// 				.status === 'accepted') {
	// 			// 				status = 'onloan';
	// 			// 				loaner = result.data[j].loaner.firstName;
	// 			// 			}
	// 			// 		}
	// 			// 		$scope.myMovies.push({
	// 			// 			title: $scope.movies[i].movie.title,
	// 			// 			poster_path: $scope.movies[i].movie.poster_path,
	// 			// 			mine: status === 'mine',
	// 			// 			onloan: status === 'onloan',
	// 			// 			loaner: loaner
	// 			// 		});
	// 			// 	}
	// 			// }
	// 			//
	// 			// for (i = 0; i < result.data.length; i++) {
	// 			// 	if (result.data[i].status === 'accepted' && result.data[i].loaner._id === $rootScope.userobj._id) {
	// 			// 		$scope.myMovies.push({
	// 			// 			title: result.data[i].movie.title,
	// 			// 			poster_path: result.data[i].movie.poster_path,
	// 			// 			borrowed: true,
	// 			// 			owner: result.data[i].owner.firstName
	// 			// 		});
	// 			// 	}
	// 			// }
	// 		});
	// };

	$scope.msg = '';
	if (!$scope.movies) {
		$http.get('/api/movie')
			.then(function(result) {
				$scope.movies = result.data;
				// fillMyMovies();
			});
	} else {
		// fillMyMovies();
	}

	$scope.movieDetails = function(item) {
		if (item.onloan) {
			$scope.msg = item.loaner + ' borrowed "' + item.title + '" from you.';
		}

		if (item.borrowed) {
			$scope.msg = item.owner + ' lent you the title "' + item.title + '".';
		}
	};

	$scope.hide_msg = function() {
		$scope.msg = '';
	};

	$scope.mineOrLoan = function(item) {
		// return (item.owner._id === $rootScope.userobj._id || item.loaner._id === $rootScope.userobj._id);
		if (item.owner._id === $rootScope.userobj._id) {
			return true;
		}

		if (item.loaner) {
			if (item.owner._id === $rootScope.userobj._id) {
				return true;
			}
		}
		return false;
	};

	$scope.borrowed = function(item) {
		return (item.status === 'on_loan' && item.loaner._id === $rootScope.userobj._id);
	};

	$scope.onloan = function(item) {
		console.log('* onloan: ', item);
		return (item.status === 'on_loan' && item.owner._id === $rootScope.userobj._id);
	};

});

movieControllers.controller('CtrlMyTrades', function($http, $scope, $rootScope) {
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	$scope.format = function(date) {
		var d = new Date(date);
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
	};

	$scope.openRequests = function(item) {
		return (item.status === 'request' && item.owner._id === $rootScope.userobj._id);
	};

	$scope.borrowed = function(item) {
		return (item.status === 'on_loan' && item.loaner._id === $rootScope.userobj._id);
	};

	$scope.onloan = function(item) {
		return (item.status === 'on_loan' && item.owner._id === $rootScope.userobj._id);
	};

	$scope.accept = function(movie) {
		movie.status = 'on_loan';
		movie.created = new Date();
		$http.put('/api/movie', movie)
			.then(function(result) {});
	};

	$scope.decline = function(movie) {
		movie.status = 'with_owner';
		$http.put('/api/movie', movie)
			.then(function(result) {});
	};

	$scope.return = function(movie) {
		movie.status = 'with_owner';
		movie.created = new Date();
		$http.put('/api/movie', movie)
			.then(function(result) {});
	};

	if (!$scope.movies) {
		$http.get('/api/movie')
			.then(function(result) {
				$scope.movies = result.data;
			});
	}

});
