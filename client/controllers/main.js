var angular = require('angular');
var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('CtrlAllMovies', ['$http', '$scope', function($http, $scope) {
	console.log('CtrlAllMovies');
	// MOCK MOVIES
	$scope.movies = [
		{
			id: 'tt2503944',
			title: 'Burnt',
			img: 'http://ia.media-imdb.com/images/M/MV5BNjEzNTk2OTEwNF5BMl5BanBnXkFtZTgwNzExMTg0NjE@._V1_SX214_AL_.jpg'
		}, {
			id: 'tt0098635',
			title: 'When Harry Met Sally...',
			img: 'http://ia.media-imdb.com/images/M/MV5BMjE0ODEwNjM2NF5BMl5BanBnXkFtZTcwMjU2Mzg3NA@@._V1_SX214_AL_.jpg',
		}, {
			id: 'tt0041959',
			title: 'The Third Man',
			img: 'http://ia.media-imdb.com/images/M/MV5BMjMwNzMzMTQ0Ml5BMl5BanBnXkFtZTgwNjExMzUwNjE@._V1_UX182_CR0,0,182,268_AL_.jpg'
		}, {
			id: 'tt0181689',
			title: 'Minority Report',
			img: 'http://ia.media-imdb.com/images/M/MV5BMTc1NDI5NzQyNF5BMl5BanBnXkFtZTYwMjc4NTE5._V1_UX182_CR0,0,182,268_AL_.jpg'
		}
	];
}]);

movieControllers.controller('CtrlAddMovie', function($http, $scope, $rootScope) {
	console.log('This is CtrlAddMovie');
	$scope.iprefix = 'http://image.tmdb.org/t/p/w500';
	$scope.isuffix = '&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8';

	$scope.search = function (search) {
		var s = search.replace(' ', '+');
		$http.jsonp('http://api.themoviedb.org/3/search/movie?query=' + s +
			'&api_key=c4b9dc0df9605cd30fcc0d7c535a2ea8&callback=JSON_CALLBACK')
			.then(function(res) {
				$scope.movies = res.data.results;
			})
			.catch(function(err) {
				console.log('An error occurred: ', err);
			});
	};

	$scope.saveMovie = function (movie_full) {
		var movie = {
			id: movie_full.id,
			title: movie_full.title,
			poster_path: movie_full.poster_path
		};
		var body = {
			movie: movie,
			user: $rootScope.userobj
		};
console.log('SAVING ', body);
		return $http.post('/api/movie/', body)
			.then(function(result) {
				console.log('* POST MOVIE Result: ', result);
			});
	};

});

movieControllers.controller('CtrlMyMovies', ['$http', '$scope', function($http, $scope) {
	$scope.msg = 'This is CtrlMyMovies';
}]);

movieControllers.controller('CtrlMyTrades', ['$http', '$scope', function($http, $scope) {
	$scope.msg = 'This is CtrlMyTrades';
}]);
