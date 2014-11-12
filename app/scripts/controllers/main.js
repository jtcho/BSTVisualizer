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

	//Access variables from service.
	var gs = GraphService;
	$scope.nodes = gs.nodes;
	$scope.newNodeValue = '';
	$scope.inputAlertActive = false;
	var nodeRadius = gs.radius;
	var reg = gs.reg;

	/**
	 * Function: createNewNode
	 * -----------------------
	 * Called when the user enters a value to be inserted in the tree.
	 * Right now it just draws a random circle.
	 */
	$scope.createNewNode = function() {
		//Check if input text is valid..
		if (! reg.test(this.newNodeValue)) {
			this.newNodeValue = '';
			this.setInputAlert(true);
			return;
		}

		//Disable warning message.
		this.setInputAlert(false);

		var value = this.newNodeValue.substring(0, 4).toUpperCase();
		var node = new NodeModel(value);
		this.nodes.push(node);
 		this.newNodeValue = '';	//Reset input text.
	};

	/**
	 * Function: setInputAlert
	 * -----------------------
	 * Set the invalid input alert toggle.
	 */
	$scope.setInputAlert = function(state) {
		if (state)
			angular.element('.input_alert').css('opacity', '1.0');
		else
			angular.element('.input_alert').css('opacity', '0');
	};
}]);
