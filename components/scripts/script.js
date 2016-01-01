// globals $ angular
$(document)
	.ready(function() {
		$('nav ul li')
			.on('click', function(evt) {
				$('nav li')
					.removeClass('active');
				$(this)
					.addClass('active');
			});

	});

// var app = angular.module('movies', []);
var app = angular.module('movies', ['ngRoute', 'movieControllers']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/allmovies', {
			templateUrl: 'partials/allmovies.html',
			controller: 'CtrlAllMovies'
		})
		.when('/mymovies', {
			templateUrl: 'partials/mymovies.html',
			controller: 'CtrlMyMovies'
		})
		.when('/mytrades', {
			templateUrl: 'partials/mytrades.html',
			controller: 'CtrlMyTrades'
		})
		.otherwise({
			redirectTo: '/allmovies'
		});
}]); // app.config
