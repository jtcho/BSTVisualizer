'use strict';

/**
 * Function: clearNodes
 * --------------------
 * Purges all nodes from the graph
 * and clears the screen.
 */
var clearAll = function(gs) {
	//Remove pre-existing elements, if any.
	for (var i = 0; i < gs.nodes.length; i++)
		removeNode(gs.nodes[i]);
	gs.nodes = [];
	gs.keys = [];
	gs.root = '';
	if (gs.d3)
		//Remove all edges.
		gs.d3.selectAll('line').remove();
}

angular.module('bstvisualizerApp')
//Main controller.
.controller('UnbalancedCtrl', ['$scope',  'NodeModel', 'GraphService', function ($scope, NodeModel, GraphService) {

	//SERVICE HOOKS
	var gs = GraphService;
	//Draw the canvas if possible.
	//Used for transitioning to this state once d3 has loaded globally.
	if (gs.d3)
		gs.drawCanvas();

	clearAll(gs);

	gs.nodes = [];
	gs.keys = [];
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

		//Clear the board if prompted.
		if (this.newNodeValue.toUpperCase() === 'CLEAR') {
			clearAll(gs);
			this.newNodeValue = '';
			return;
		}

		//Disable warning message.
		this.setInputAlert(false);
		//Create the new node.
		var value = this.newNodeValue.substring(0, 1).toUpperCase();

		if (gs.keys.indexOf(value) > -1) {
			this.newNodeValue = '';
			return;
		}

		var node = new NodeModel(value);
		gs.nodes.push(node);
		gs.keys.push(value);
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