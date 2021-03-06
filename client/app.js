var angular = require('angular');
var $ = require('jquery');

$(document)
	.ready(function() {
		var container_height;

		$('nav ul li')
			.on('click', function(evt) {
				$('nav li')
					.removeClass('active');
				$(this)
					.addClass('active');
			});

		container_height = $(window)
			.height() - $('header')
			.height(); //get height of the window minus header

		$('.contheight')
			.css('height', container_height);

		$(window)
			.resize(function() {
				container_height = $(window)
					.height() - $('header')
					.height();
				$('.contheight')
					.css('height', container_height);
			}); //on resize

	});

var app = angular.module('movies', [require('angular-route'), require('angular-cookies'), 'movieControllers'])
	.run(function($rootScope, $http) {
		$http.get('/api/user')
			.then(function(userobj) {
				$rootScope.userobj = userobj.data;
			});
	});

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
		.when('/addmovie', {
			templateUrl: 'partials/addmovie.html',
			controller: 'CtrlAddMovie'
		})
		.otherwise({
			redirectTo: '/allmovies'
		});
}]); // app.config

require('./controllers');
require('./lib');
require('./services');
