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
		url: '/',
		views: {
			'navbar': {
				templateUrl: 'components/navbar/navbar.html',
				controller: 'NavCtrl'
			},
			'content': {
				templateUrl: 'app/main/main.html',
				controller: 'MainCtrl'
			}
		}
	})
	.state('visualizer', {
		url: '/',
		views: {
			'unbalanced': {
				templateUrl: 'views/unbalancedTree.html',
				controller: 'UnbalancedCtrl'
			}
		}
	})
	;
})
;
