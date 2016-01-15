var angular = require('angular');
var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('CtrlAllMovies', function($http, $scope, $rootScope) {
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	$http.get('/api/movie')
		.then(function(result) {
			$scope.movies = result.data;
		});

	$scope.addtrade = function(movie) {
		// If own movie
		if (movie.owner._id === $rootScope.userobj._id) {
			$scope.msg = 'You own the title ' + movie.movie.title + ' yourself ...';
		} else {
			var body = {
				loaner: {
					_id: $rootScope.userobj._id,
					firstName: $rootScope.userobj.firstName
				},
				owner: {
					_id: movie.owner._id,
					firstName: movie.owner.firstName
				},
				movie: {
					_id: movie.movie.id,
					title: movie.movie.title,
					poster_path: movie.movie.poster_path
				},
				status: 'open'
			};
			return $http.post('/api/trade', body)
				.then(function(result) {
					$scope.trade = body;
				});
		}
	};

	$scope.hide_trade = function() {
		$scope.trade = '';
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

	var fillMyMovies = function() {
		$scope.myMovies = [];
		var i, status, j, loaner;

		$http.get('/api/trade')
			.then(function(result) {

				for (i = 0; i < $scope.movies.length; i++) {
					if ($scope.movies[i].owner._id === $rootScope.userobj._id) {
						// Check whether this movie is on loan
						status = 'mine'; loaner = '';
						for (j = 0; j < result.data.length; j++) {
							if (result.data[j].movie._id === $scope.movies[i].movie.id && result.data[j]
								.status === 'accepted') {
								status = 'onloan';
								loaner = result.data[j].loaner.firstName;
							}
						}
						$scope.myMovies.push({
							title: $scope.movies[i].movie.title,
							poster_path: $scope.movies[i].movie.poster_path,
							mine: status === 'mine',
							onloan: status === 'onloan',
							loaner: loaner
						});
					}
				}

				for (i = 0; i < result.data.length; i++) {
					if (result.data[i].status === 'accepted' && result.data[i].loaner._id === $rootScope.userobj._id) {
						$scope.myMovies.push({
							title: result.data[i].movie.title,
							poster_path: result.data[i].movie.poster_path,
							borrowed: true,
							owner: result.data[i].owner.firstName
						});
					}
				}
			});
	};

	$scope.msg = '';
	if (!$scope.movies) {
		$http.get('/api/movie')
			.then(function(result) {
				$scope.movies = result.data;
				fillMyMovies();
			});
	} else {
		fillMyMovies();
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

});

movieControllers.controller('CtrlMyTrades', function($http, $scope, $rootScope) {
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	$http.get('/api/trade')
		.then(function(result) {
			$scope.trades = result.data;
		});

	$scope.format = function(date) {
		var d = new Date(date);
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
	};

	$scope.openRequests = function(item) {
		return (item.status === 'open' && item.owner._id === $rootScope.userobj._id);
	};

	$scope.borrowed = function(item) {
		return (item.status === 'accepted' && item.loaner._id === $rootScope.userobj._id);
	};

	$scope.onloan = function(item) {
		return (item.status === 'accepted' && item.owner._id === $rootScope.userobj._id);
	};

	$scope.accept = function(trade) {
		trade.status = 'accepted';
		$http.put('/api/trade', trade)
			.then(function(result) {});
	};

	$scope.decline = function(trade) {
		trade.status = 'declined';
		$http.put('/api/trade', trade)
			.then(function(result) {});
	};

	$scope.return = function(trade) {
		trade.status = 'returned';
		$http.put('/api/trade', trade)
			.then(function(result) {});
	};
});
