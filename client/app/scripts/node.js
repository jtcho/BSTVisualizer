'use strict';

/**
 * Type: Node
 * ------------
 * Defines an abstract Node object, an arbitrary
 * element in a tree.
 */
var Node = function(val) {

	this.val = val;
	this.left = '';
	this.right = '';

	this.x = 0;
	this.y = 0;
	this.radius = 0;
	this.svg = '';

};

Node.prototype.init = function(gs) {

	this.radius = gs.radius;
	if (! gs.root) {
		this.x = gs.width / 2;
		this.y = 200;
		this.parentNode = '';
		gs.root = this;
	}
	else {
		this.parentNode = findParentNode(gs.root, this.val);
		//this.radius = this.parentNode.radius * 0.7;
		this.y = this.parentNode.y + this.radius*3;

		var xShift = this.radius*2*(1+Math.exp(-1 * this.depth()/8));
		if (this.val < this.parentNode.val) {
			this.parentNode.left = this;
			this.x = this.parentNode.x - xShift;
		}
		else {
			this.parentNode.right = this;
			this.x = this.parentNode.x + xShift;
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
 * Function: translate
 * -------------------
 * Translates ONLY this node and animates.
 */
Node.prototype.translate = function(dx, dy) {
	//
	var transformString = 'translate(' + dx + ' ' + dy + ')';
	this.svg
	.transition()
	.duration(2000)
	.attr('transform', transformString);

	this.x += dx;
	this.y += dy;
};

/**
 * Function: translate
 * -------------------
 * Translates this node to the new position.
 */
Node.prototype.translateTo = function(xp, yp) {
	//
	this.translate(xp - this.x, yp - this.y);
};

/**
 * Function: visit
 * ---------------
 * 'Visits' the node, marking it visually.
 */
Node.prototype.visit = function() {
	this.svg.select('circle')
		.attr('class', 'visited node');
};

/**
 * Function: unvisit
 * -----------------
 * 'Unvisits' the node, removing the marking.
 */
Node.prototype.unvisit = function() {
	this.svg.select('circle')
		.attr('class', 'node');
};

/**
 * Function: draw
 * ---------------
 * @param gs - the graph service
 */
Node.prototype.draw = function(gs) {
	var scalingFactor = this.radius / gs.radius;
	var d3 = gs.d3;

	//Remove old node from canvas.
	if (this.svg)
		this.svg.remove();

	var svg = gs.zoomLayer.append('g');
	this.svg = svg;

	svg.append('circle')
		.attr('cx', this.x)
		.attr('cy', this.y)
		.attr('r', this.radius)
		.attr('class', 'node')
		;
	svg.append('text').text(this.val)
		.attr('x', this.x)
		.attr('y', this.y + 15 * scalingFactor)
		.attr('text-anchor', 'middle')
		.attr('font-size', 50 * scalingFactor)
		;
};

/**
 * Function: drawEdge
 * ------------------
 * @param node - the node to draw an edge to
 * @param gs - the graph service
 */
Node.prototype.drawEdge = function(node, gs) {
	var svg = gs.zoomLayer;

	var theta = Math.atan((node.y - this.y)/(node.x - this.x));
	var xo2 = node.radius * Math.cos(theta);
	var yo2 = node.radius * Math.sin(theta);
	var xo1 = this.radius * Math.cos(theta);
	var yo1 = this.radius * Math.sin(theta);
	var dir = (this.val <= node.val) ? 1 : -1;

	svg.append('line')
		.attr('class', 'link')
		.attr('x1', this.x + dir*xo1)
		.attr('y1', this.y + dir*yo1)
		.attr('x2', node.x - dir*xo2)
		.attr('y2', node.y - dir*yo2)
	;
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
 * Type: ANode
 * -----------
 * Defines a self-balancing AVL Tree node.
 */
 var ANode = function(val, gs) {
 	Node.call(this, val);
 	this.init(gs, val);
 };

ANode.prototype = new Node();

ANode.prototype.init = function(gs, val) {
	if (! gs.root) {
		this.x = gs.width / 2;
		this.y = 200;
		this.parentNode = '';
		this.radius = gs.radius;
		gs.root = this;
	}
	//Handle coordinate calculations here...
	else {
		this.parentNode = findParentNode(gs.root, this.val);
		this.radius = this.parentNode.radius * 0.7;
		this.y = this.parentNode.y + this.radius*3;

		var xShift = this.radius*2*(1+Math.exp(-1 * this.depth()/8));
		if (this.val < this.parentNode.val) {
			this.x = this.parentNode.x - xShift;
		}
		else {
			this.x = this.parentNode.x + xShift;
		}

 		this.insert(gs.root, val);
	}
}

/**
 * Function: insert
 * ----------------
 * Insert this node into the given root's subtree.
 * Also rebalances the tree as necessary.
 */
ANode.prototype.insert = function(node, val) {
	if (val < node.val) {
		//If the left node is not null, recurse.
		if (node.left)
			this.insert(node.left, val);
		//Otherwise, insert.
		else
			node.left = this;
		//Check heights.
		if (height(node.left) - height(node.right) == 2) {
			console.log('Imbalance found at node of value: ' + node.val);
			if (val < node.left.val) {
				console.log('Left left case.');
			}
		}
	}
	else {
		//If the right node is null, insert.
		if (node.right)
			this.insert(node.right, val);
		else
			node.right = this;
		//Check heights.
		if (height(node.right) - height(node.left) == 2) {
			console.log('Imbalance found at node of value: ' + node.val);
			if (val > node.right.val) {
				console.log('Right right case.');
			}
		}
	}
}

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












