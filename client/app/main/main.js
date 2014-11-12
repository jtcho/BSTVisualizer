'use strict';

/**
 * @ngdoc function
 * @name bstvisualizerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bstvisualizerApp
 */
angular.module('bstvisualizerApp')
//Set up states.
.config(function($stateProvider) {
	$stateProvider
	.state('main', {
		abstract: true,
		url: '',
		templateUrl: 'app/main/main.html'
	})
	.state('main.load', {
		url: '/', //default for now, change later
		views: {
			'navbar': {
				templateUrl: 'components/navbar/navbar.html',
				controller: 'NavCtrl'
			},
			'content': {
				templateUrl: 'app/main/main.load.html'
			}
		}
	})
	.state('main.load.about', {
		url: 'about',
		templateUrl: 'app/about/about.html',
		controller: function() {}
	})
	.state('main.load.unbalanced', {
		url: 'unbalanced',
		templateUrl: 'app/unbalanced_tree/unbalancedTree.html',
		controller: 'UnbalancedCtrl'
	})
	;
})
;
