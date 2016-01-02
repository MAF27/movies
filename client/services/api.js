var app = require('angular')
	.module('nightlife');

app.factory('api', apiFactory);

apiFactory.$inject = ['$http'];

function apiFactory($http) {
	return {
		getUser: getUser,
		saveGoing: saveGoing,
		getGoings: getGoings
	};

	function getUser() {
		return $http.get('/api/user')
			.then(function(response) {
					return response.data;
				},
				function(reason) {
					console.log(reason);
				});
	}

	function saveGoing(rest_id, username) {
		return $http.post('/api/going', { rest_id: rest_id, username: username } )
			.then(function(response) {
					return response.data;
				},
				function(reason) {
					console.log(reason);
				});
	}

	function getGoings(rest_id) {
		return $http.get('/api/get-goings/' + rest_id)
			.then(function(response) {
					return response.data;
				},
				function(reason) {
					console.log(reason);
				});
	}

}
