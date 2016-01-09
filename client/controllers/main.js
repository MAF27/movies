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

	var get = function(idx, id) {
		$http.jsonp('http://imdb.wemakesites.net/api/tt2503944' + '?callback=JSON_CALLBACK')
			.then(function(res) {
				$scope.movie = res.data.data.title;
				$scope.movie_img = res.data.data.image;
			})
			.catch(function(err) {
				console.log('An error occurred: ', err);
			});
	};

	// for (var i = 0; i < $scope.movies.length; i++) {
	// 	get(i, $scope.movies[i].id);
	// }

}]);

movieControllers.controller('CtrlAddMovie', ['$http', '$scope', function($http, $scope) {
	console.log('This is CtrlAddMovie');

	$scope.search = function (s) {
		console.log('Searching for ' + s);
	};

}]);

movieControllers.controller('CtrlMyMovies', ['$http', '$scope', function($http, $scope) {
	$scope.msg = 'This is CtrlMyMovies';
}]);

movieControllers.controller('CtrlMyTrades', ['$http', '$scope', function($http, $scope) {
	$scope.msg = 'This is CtrlMyTrades';
}]);
