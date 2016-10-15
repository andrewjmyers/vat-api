angular.module('docsApp', [
	'ngRoute'
]).config(['$locationProvider', '$routeProvider', function config($locationProvider, $routeProvider) {
  	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix("!");

	$routeProvider.when('/home', {
		templateUrl: 'pages/default.html'
	}).when('/clients', {
		templateUrl: 'pages/clients.html'
	}).otherwise('/home');
}]);
