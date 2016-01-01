// globals angular
var movieControllers = angular.module('movieControllers', []);

movieControllers.controller('CtrlAllMovies', ['$http', '$scope', function($http, $scope){
	$scope.msg = 'This is CtrlAllMovies';
}]);

movieControllers.controller('CtrlMyMovies', ['$http', '$scope', function($http, $scope){
	$scope.msg = 'This is CtrlMyMovies';
}]);

movieControllers.controller('CtrlMyTrades', ['$http', '$scope', function($http, $scope){
	$scope.msg = 'This is CtrlMyTrades';
}]);
