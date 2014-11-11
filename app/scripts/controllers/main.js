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
				templateUrl: 'views/navbar.html',
				controller: 'NavCtrl'
			},
			'content': {
				templateUrl: 'views/main.html',
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
//Main controller.
.controller('MainCtrl', ['$scope',  'NodeModel', 'GraphService', function ($scope, NodeModel, GraphService) {
	//Link to the service.
	$scope.nodes = GraphService.nodes;

	/**
	 * Function: createNewNode
	 * -----------------------
	 * Called when the user enters a value to be inserted in the tree.
	 */
	$scope.createNewNode = function() {
		console.log($scope.newNodeValue);
		$scope.nodes.push(new NodeModel({
 			x: Math.floor((Math.random() * GraphService.width)), 
 			y: Math.floor((Math.random() * GraphService.height))
 		}, 2));
	};
}]);
