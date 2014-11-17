'use strict';

//

angular.module('bstvisualizerApp')
.controller('AVLCtrl', ['$scope', 'GraphService', function($scope, GraphService) {

	var gs = GraphService;

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
		console.log('Creating new AVL Node.');

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
		//
		var value = this.newNodeValue.substring(0, 1).toUpperCase();

		if (gs.keys.indexOf(value) > -1) {
			this.newNodeValue ='';
			return;
		}

		var node = new ANode(value, gs);
		node.posX = Math.random() * gs.width;
		node.posY = Math.random() * gs.height;
		node.draw(gs);

		//Fix layout.
		fixTree(gs.root, gs);

		gs.nodes.push(node);
		gs.keys.push(value);
		this.newNodeValue = '';

		//Update all the balance factor labels.
		this.updateNodeLabels(gs.nodes);

		//AVL Rebalance.
		rebalanceAVL(node);

		//Fix layout again.
	};

	/**
	 * Function: updateNodeLabels
	 * --------------------------
	 * Update all of the node labels to reflect their balance factor.
	 */
	$scope.updateNodeLabels = function(nodes) {
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].label = nodes[i].balanceFactor();
			nodes[i].updateLabel();
		}
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

/**
 * Function: rebalanceAVL
 * ----------------------
 * Rebalances an AVL tree from the bottom up.
 */
var rebalanceAVL = function(node) {
	//Base case, end recursion.
	if (! node)
		return;

	//If there's an imbalance, rectify.
	if (Math.abs(node.balanceFactor()) >= 2) {
		console.log('Node with value ' + node.val + ' needs rebalancing.');
		//Check left subtree for imbalance.
		if (node.left) {
			//If left node has a positive balance factor, rotate left first.
			if (node.left.balanceFactor() === -1) {
				console.log('Rotating subtree ' + node.left.val + ' left.');
			}
			console.log('Rotating subtree ' + node.val + ' right.');
		}
		//Right subtree has imbalance.
		else {
			if (node.right.balanceFactor() === 1) {
				console.log('Rotating subtree ' + node.right.val + ' right.');
			}
			console.log('Rotating subtree ' + node.val + ' left.');
		}
	}

	//Recurse upwards.
	rebalanceAVL(node.parentNode);
};








