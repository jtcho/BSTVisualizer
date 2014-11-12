'use strict';

angular.module('bstvisualizerApp')
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

		var value = this.newNodeValue.substring(0, 1).toUpperCase();
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
			angular.element('.input_alert').css('opacity', '0.9');
		else
			angular.element('.input_alert').css('opacity', '0');
	};
}]);