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
		node.drawAtPosition(gs, node.posX, node.posY);

		//Fix layout.
		fixTree(gs.root, gs);

		gs.nodes.push(node);
		gs.keys.push(value);
		this.newNodeValue = '';

		//AVL Rebalance.
		rebalanceAVL(node, gs);

		//Fix layout again.
		fixTree(gs.root, gs);

		//Update all the balance factor labels.
		this.updateNodeLabels(gs.nodes);

	};

	/**
	 * Function: updateNodeLabels
	 * --------------------------
	 * Update all of the node labels to reflect their balance factor.
	 */
	$scope.updateNodeLabels = function(nodes) {
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].label = 'Ht: ' + (nodes[i].height - 1) + ' Bal: ' + nodes[i].balanceFactor();
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
var rebalanceAVL = function(node, gs) {
	//Base case, end recursion.
	if (! node)
		return;

	//Lopsided to left.
	if (node.balanceFactor() >= 2) {
		//If the left side node is imbalanced to the right sightly, rotate left first.
		if (node.left.balanceFactor() === -1) {
			rotateLeft(node.left.right, gs);
		}
		rotateRight(node.left, gs);
		rebalanceAVL(node.left.parentNode, gs);
	}
	else if (node.balanceFactor() <= -2) {
		if (node.right.balanceFactor() === 1) {
			rotateRight(node.right.left, gs);
		}
		rotateLeft(node.right, gs);
		rebalanceAVL(node.right.parentNode, gs);
	}
	else
		//Recurse upwards.
		rebalanceAVL(node.parentNode, gs);
};

/**
 * Function: rotateRight
 * ---------------------
 * Rotates a particular node to the right.
 */
var rotateRight = function(node, gs) {
	node.visit();
	var parent = node.parentNode;
	node.parentNode = parent.parentNode;

	if (node.parentNode) {
		if (node.parentNode.left === parent)
			node.parentNode.left = node;
		else
			node.parentNode.right = node;
	}

	//If the old parent was the root of the tree, update root.
	if (parent === gs.root)
		gs.root = node;

	parent.left = node.right;
	if (node.right)
		node.right.parentNode = parent;
	node.right = parent;
	parent.parentNode = node;

	//Decrease height of old parent by 1.
	// parent.updateHeight();
	// node.updateHeight();
	parent.height = Math.max((parent.right) ? parent.right.height + 1 : 1, (parent.left) ? parent.left.height + 1 : 1);
	node.height = Math.max((node.left) ? node.left.height + 1 : 1, node.right.height + 1);
	node.updateParentHeights();
};

/**
 * Function: rotateLeft
 * ---------------------
 * Rotates a particular node to the left.
 */
var rotateLeft = function(node, gs) {
	node.visit();
	var parent = node.parentNode;
	node.parentNode = parent.parentNode;

	if (node.parentNode) {
		if (node.parentNode.left === parent)
			node.parentNode.left = node;
		else
			node.parentNode.right = node;
	}

	if (parent === gs.root)
		gs.root = node;

	parent.right = node.left;
	if (node.left)
		node.left.parentNode = parent;
	node.left = parent;
	parent.parentNode = node;

	parent.height = Math.max((parent.left) ? parent.left.height + 1: 1, (parent.right) ? parent.right.height + 1: 1);
	node.height = Math.max((node.right) ? node.right.height + 1 : 1, node.left.height + 1);
	node.updateParentHeights();
};






