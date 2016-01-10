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
			$scope.msg = 'You own the movie ' + movie.movie.title + ' yourself ...';
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
	console.log('This is CtrlAddMovie');
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
	$scope.msg = 'This is CtrlMyMovies';
});

movieControllers.controller('CtrlMyTrades', function($http, $scope, $rootScope) {
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	$http.get('/api/trade')
		.then(function(result) {
			$scope.trades = result.data;
		});

	$scope.format = function (date) {
		var d = new Date(date);
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  	return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
	};

	$scope.openRequests = function (item) {
		return (item.status === 'open' && item.owner._id === $rootScope.userobj._id);
	};

	$scope.borrowed = function (item) {
		return (item.status === 'accepted' && item.loaner._id === $rootScope.userobj._id);
	};

	$scope.accept = function (trade) {
		trade.status = 'accepted';
		$http.put('/api/trade', trade)
			.then(function(result) {
			});
	};

	$scope.decline = function (trade) {
		trade.status = 'declined';
		$http.put('/api/trade', trade)
			.then(function(result) {
			});
	};

	$scope.return = function (trade) {
		trade.status = 'returned';
		$http.put('/api/trade', trade)
			.then(function(result) {
			});
	};
});
