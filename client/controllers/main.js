var angular = require('angular');
var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('CtrlAllMovies', ['$http', '$scope', function($http, $scope) {
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	$http.get('/api/movie')
		.then(function(result) {
			$scope.movies = result.data;
		});

}]);

movieControllers.controller('CtrlAddMovie', function($http, $scope, $rootScope) {
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

				console.log('* POST MOVIE Result: ', result);
			});
	};

	$scope.hide_added_movie = function() {
		$scope.added_movie = '';
	};

	$scope.filternull = function(item) {
		// console.log('* Filter Null: ', a, e);
		return item.poster_path !== null;
	};

});

movieControllers.controller('CtrlMyMovies', ['$http', '$scope', function($http, $scope) {
	$scope.msg = 'This is CtrlMyMovies';
}]);

movieControllers.controller('CtrlMyTrades', ['$http', '$scope', function($http, $scope) {
	$scope.msg = 'This is CtrlMyTrades';
}]);
