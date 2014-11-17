'use strict';

/**
 *
 */
var onAnimationEnd = 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd';

/**
 * Type: Node
 * ------------
 * Defines an abstract Node object, an arbitrary
 * element in a tree.
 */
var Node = function(val) {
	//Logic Parameters
	this.val = val;
	this.left = '';
	this.right = '';
	this.label = '';

	//Drawing Parameters
	this.X = 0;		//x index
	this.mod = 0;	//amount to shift this node and its subtree
	this.posX = 0;	//x position coordinate
	this.posY = 0;	//y position coordinate
	this.oldX = 0;
	this.oldY = 0;
	this.radius = 0;//radius of node
	this.svg = '';	//correspondent svg group
	this.edges = [];//drawn edges 
	this.animationQueue = [];
	this.visited = false;
	this.isNew = true;

};

Node.prototype.init = function(gs) {

	this.radius = gs.radius;
	if (! gs.root) {
		this.posX = gs.width / 2;
		this.posY = 200;
		this.parentNode = '';
		gs.root = this;
	}
	else {
		this.parentNode = findParentNode(gs.root, this.val);
		this.posY = this.parentNode.posY + this.radius*3;

		var xShift = this.radius*2*(1+Math.exp(-1 * this.depth()/8));
		if (this.val < this.parentNode.val) {
			this.parentNode.left = this;
			this.posX = this.parentNode.posX - xShift;
		}
		else {
			this.parentNode.right = this;
			this.posX = this.parentNode.posX + xShift;
		}
	}
}

/**
 * Function: depth
 * ----------------
 * Find the depth of the present Node.
 */
Node.prototype.depth = function() {
	if (! this.parentNode)
		return 0;
	return 1 + this.parentNode.depth();
};

/**
 * Function: visit
 * ---------------
 * 'Visits' the node, marking it visually.
 */
Node.prototype.visit = function() {
	this.visited = true;
	this.svg.select('circle')
		.attr('class', 'node visited');
};

/**
 * Function: unvisit
 * -----------------
 * 'Unvisits' the node, removing the marking.
 */
Node.prototype.unvisit = function() {
	this.visited = false;
	this.svg.select('circle')
		.attr('class', 'node');
};

/**
 * Function: updateLabel
 * ---------------------
 * Updates and redraws only the label text.
 */
Node.prototype.updateLabel = function() {
	// if (this.label) {
		this.svg.select('#label').text(this.label);
	// }
}

/**
 * Function: draw
 * ---------------
 * @param gs - the graph service
 */
// Node.prototype.draw = function(gs) {
// 	this.drawAtPosition(gs, this.oldX, this.oldY);
// };

Node.prototype.drawAtPosition = function(gs, px, py) {
	var d3 = gs.d3;

	//Remove old node from canvas.
	if (this.svg)
		this.svg.remove();

	var svg = gs.zoomLayer.append('g');
	this.svg = svg;

	//Label svg element.
	svg.attr('id', '#'+this.val);

	var classString = 'node' + ((this.visited) ? ' visited' : '');

	svg.append('circle')
		.attr('cx', px)
		.attr('cy', py)
		.attr('r', this.radius)
		.attr('class', classString)
		;
	svg.append('text').text(this.val)
		.attr('x', px)
		.attr('y', py + 20)
		.attr('text-anchor', 'middle')
		.attr('font-size', 50)
		;
	svg.append('text').attr('id', 'label')
		.attr('x', px)
		.attr('y', py + 50)
		.attr('text-anchor', 'middle')
		.attr('font-size', 30)
		;

};

var animationQueueCallback = function(gs, node) {
	//Pop the animation that just finished.
	node.animationQueue.shift();
	//If there are any outstanding animations, try.
	if (node.animationQueue.length > 0) {
		var animation = node.animationQueue[0];
		this.drawAtPosition(gs, animation.oldX, animation.oldY);

		node.svg.transition()
			.duration(animation.duration)
			.attr('transform', animation.transform)
			.each('end', animationQueueCallback(node));

	}
	setTimeout(function() {
		if (node.visited)
			node.unvisit();
	}, 2000);
};

Node.prototype.enqueueAnimation = function(gs, animation) {

	this.animationQueue.push(animation);
	//If no prior queued animations, just start immediately.
	if (this.animationQueue.length === 1) {
		this.drawAtPosition(gs, animation.oldX, animation.oldY);
		
		this.svg.transition()
			.duration(animation.duration)
			.attr('transform', animation.transform)
			.each('end', animationQueueCallback(gs, this));
	}
	else {
	}
};

/**
 * Function: drawEdge
 * ------------------
 * @param node - the node to draw an edge to
 * @param gs - the graph service
 */
Node.prototype.drawEdge = function(node, gs) {
	var svg = gs.zoomLayer;

	var theta = Math.atan((node.posY - this.posY)/(node.posX - this.posX));

	var xo2 = node.radius * Math.cos(theta);
	var yo2 = node.radius * Math.sin(theta);
	var xo1 = this.radius * Math.cos(theta);
	var yo1 = this.radius * Math.sin(theta);
	var dir = (this.val <= node.val) ? 1 : -1;

	var edge = svg.append('line')
		.attr('class', 'link')
		.attr('x1', this.posX + dir*xo1)
		.attr('y1', this.posY + dir*yo1)
		.attr('x2', node.posX - dir*xo2)
		.attr('y2', node.posY - dir*yo2)
	;

	this.edges.push(edge);
};

/**
 *
 */
Node.prototype.clearEdges = function() {
	for (var i = 0; i < this.edges.length; i++) {
		// this.edges[i].attr('class', 'link faded');
		// var toRemove = this.edges[i];
		// setTimeout(function() {
		// 	toRemove.remove();
		// }, 2000);
		this.edges[i].remove();
	}
};


/**
 * Function: removeNode
 * --------------------
 * Remove a node from the canvas.
 */
 Node.prototype.removeNode = function() {
 	if (this.svg) {
 		this.svg.remove();
 		this.svg = '';
 	}
 };

/**
 * Function: isLeaf
 * ----------------
 * Returns whether this node is a leaf node.
 */
 Node.prototype.isLeaf = function() {
 	return !(this.left || this.right);
 };

/**
 * Function: isLeftMost
 * --------------------
 * Returns whether this node is a leftmost child node.
 */
 Node.prototype.isLeftMost = function() {
 	return (! this.parentNode) || (! this.parentNode.left) || this.parentNode.left === this;
 };

/**
 * Function: getLeftSibling
 * ------------------------	
 */
 Node.prototype.getLeftSibling = function() {
 	return this.parentNode.left;
 };

/**
 * Type: ANode
 * -----------
 * Defines a self-balancing AVL Tree node.
 */
 var ANode = function(val, gs) {
 	Node.call(this, val);
 	this.init(gs, val);
 	

 	//Propagate heights upward.
 	this.height = 1;
 	this.updateParentHeights();
 };

ANode.prototype = new Node();

/**
 *
 */
 ANode.prototype.updateHeight = function() {
 	this.height = Math.max((this.left) ? this.left.height + 1 : 1, (this.right) ? this.right.height + 1 : 1);
 };

 ANode.prototype.updateParentHeights = function() {
 	for (var parent = this.parentNode; parent; parent = parent.parentNode) {
 		parent.updateHeight();
 	}
 };

/**
 * Function: balanceFactor
 * -----------------------
 * Returns the balance factor for this particular AVL node,
 * given by the height difference betwen the left subtree
 * and the right subtree.
 */
ANode.prototype.balanceFactor = function() {
	return ((this.left) ? this.left.height : 0) - ((this.right) ? this.right.height : 0);
};

/**
 * Type: UNode
 * ------------
 * Defines an unbalanced Binary Search Tree node.
 */
var UNode = function(val, gs) {

	Node.call(this, val);
	this.init(gs);
};

UNode.prototype = new Node();












