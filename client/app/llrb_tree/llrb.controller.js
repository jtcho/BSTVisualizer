'use strict';

angular.module('bstvisualizerApp')
.controller('LLRBCtrl', ['$scope', 'GraphService', function($scope, GraphService) {

	var gs = GraphService;

	if (gs.d3)
		gs.drawCanvas();

	clearAll(gs);

	gs.nodes = [];
	gs.keys = [];
	
	$scope.newNodeValue = '';
	$scope.inputAlertActive = false;
	$scope.history = '';

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
			this.setInputAlert(true, 'Please enter a valid alphabetical string.');
			return;
		}

		//Clear the board.
		if (this.newNodeValue.toUpperCase() === 'CLEAR') {
			clearAll(gs);
			this.newNodeValue = '';
			this.history = '';
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

		this.history += value;

		var node = new LNode(value, gs);
		node.posX = Math.random() * gs.width;
		node.posY = Math.random() * gs.height;
		node.drawAtPosition(gs, node.posX, node.posY);

		//Fix layout.
		fixTree(gs.root, gs);

		if (node === gs.root)
			node.setRed(false);

		//
		rebalanceLLRB(node, gs);

		fixTree(gs.root, gs);

		gs.nodes.push(node);
		gs.keys.push(value);
		this.newNodeValue = '';
	};

	/**
	 * Function: setInputAlert
	 * -----------------------
	 * Set the invalid input alert toggle.
	 */
	$scope.setInputAlert = function(state, text) {
		if (state) {
			angular.element('.input_alert').css('display', 'inline-block');
			angular.element('.input_alert').css('opacity', '0.9');
			$scope.alertText = text;
		}
		else {
			angular.element('.input_alert').css('display', 'none');
		}
	};

}]);

/**
 * Function: rebalanceLLRB
 * -----------------------
 * Rebalances the LLRB tree, from the bottom up.
 */
var rebalanceLLRB = function(node, gs) {
	if (! node || node === gs.root)
		return;

	// console.log('Checking ' + node.val +'.');

	//If right leaning red node,
	if (node.parentNode && node.parentNode.right === node && node.isRed) {
		var oldParent = node.parentNode;
		// console.log(node.val + ': Rightwards leaning red node.');

		if (node.parentNode.left && node.parentNode.left.isRed) {
			// console.log(node.val + ': Left sibling is red, too! Color flipping.');
			
			node.parentNode.left.setRed(false, 1);
			node.parentNode.setRed(true, 4);
			node.setRed(false, 1);
		}
		else {
			// console.log(node.val + ': Rotating left.');
			llrb_rotateLeft(node, gs);

			rebalanceLLRB(node.left, gs);
			return;
		}
	}

	//If left leaning red node,
	if (node.isRed && node.parentNode && node.parentNode != gs.root && node.parentNode.isRed) {
		// console.log(node.val + ': Two reds in a row, rotating right.');
		var parent = node.parentNode;
		llrb_rotateRight(parent, gs);

		//
		if (node.isRed && parent.right.isRed) {
			// console.log(node.val + ': Right sibling is red, too! Color flipping.');
			node.setRed(false, 1);
			parent.right.setRed(false, 1);
			parent.setRed(true, 4);
		}
	}

	rebalanceLLRB(node.parentNode, gs);
};

/**
 * Function: rotateRight
 * ---------------------
 * Rotates a particular node to the right.
 */
var llrb_rotateRight = function(node, gs) {
	// console.log('Rotating ' + node.val + ' right.');
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
	if (parent === gs.root) {
		gs.root = node;
		// gs.root.setRed(false);
	}

	parent.left = node.right;
	if (node.right)
		node.right.parentNode = parent;
	node.right = parent;
	parent.parentNode = node;

	node.setRed(parent.isRed, 2);
	parent.setRed(true, 2);
};

/**
 * Function: rotateLeft
 * ---------------------
 * Rotates a particular node to the left.
 */
var llrb_rotateLeft = function(node, gs) {
	node.visit();
	var parent = node.parentNode;
	node.parentNode = parent.parentNode;

	if (node.parentNode) {
		if (node.parentNode.left === parent)
			node.parentNode.left = node;
		else
			node.parentNode.right = node;
	}

	if (parent === gs.root) {
		gs.root = node;
		// gs.root.setRed(false);
	}

	parent.right = node.left;
	if (node.left)
		node.left.parentNode = parent;
	node.left = parent;
	parent.parentNode = node;

	node.setRed(parent.isRed, 2);
	parent.setRed(true, 2);
};





