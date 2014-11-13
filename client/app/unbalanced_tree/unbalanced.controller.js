'use strict';

angular.module('bstvisualizerApp')
//Main controller.
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

		var node = '';

		if (! gs.root) {
			node = new Node(gs.width / 2, 200, value);
			node.radius = gs.radius;
			gs.root = node;
		}
		else {
			node = new Node(0, 0, value);
			node.parentNode = findParentNode(gs.root, value);
			node.radius = node.parentNode.radius * 0.7;
			node.y = node.parentNode.y + node.radius*3;

			//Exponential decay because drawing trees is hard.
			var xShift = node.radius*2*(1+Math.exp(-1 * node.depth()/8));
			//Inserting on the left...
			if (node.val < node.parentNode.val) {
				node.parentNode.left = node;
				node.x = node.parentNode.x - xShift;
			}
			else {
				node.parentNode.right = node;
				node.x = node.parentNode.x + xShift;
			}
		}

		node.draw(gs);
		if (node.parentNode)
			node.drawEdge(node.parentNode, gs);

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