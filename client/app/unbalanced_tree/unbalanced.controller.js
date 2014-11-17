'use strict';

angular.module('bstvisualizerApp')
.controller('UnbalancedCtrl', ['$scope', 'GraphService', function ($scope, GraphService) {
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

		//Check if input text is valid.
		if (! reg.test(this.newNodeValue)) {
			this.newNodeValue = '';
			this.setInputAlert(true);
			return;
		}

		//Clear the board.
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

		var node = new UNode(value, gs);
		node.posX = Math.random() * gs.width;
		node.posY = Math.random() * gs.height;
		node.drawAtPosition(gs, node.posX, node.posY);

		fixTree(gs.root, gs);

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