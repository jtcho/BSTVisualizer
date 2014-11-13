'use strict';

/**
 * Type: Node
 * ------------
 * Defines an abstract Node object, an arbitrary
 * element in a tree.
 */
var Node = function(val, gs) {

	this.val = val;
	this.left = '';
	this.right = '';

	this.x = 0;
	this.y = 0;
	this.radius = 0;
	this.svg = '';
};

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
 * Function: height
 * ----------------
 * Find the height of the subtree that this
 * Node is root of.
 */
Node.prototype.height = function() {
	var leftHeight = (this.left) ? this.left.height() : 0;
	var rightHeight = (this.right) ? this.right.height() : 0;
	return Math.max(1 + leftHeight, 1 + rightHeight);
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
		.attr('y', this.y + 17 * scalingFactor)
		.attr('text-anchor', 'middle')
		.attr('font-size', 50 * scalingFactor)
		;

	//Draw link to parent if any.

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
 * Function: clearNodes
 * --------------------
 * Purges all nodes from the graph
 * and clears the screen.
 */
var clearAll = function(gs) {
	//Remove pre-existing elements, if any.
	for (var i = 0; i < gs.nodes.length; i++)
		gs.nodes[i].removeNode();
	gs.nodes = [];
	gs.keys = [];
	gs.root = '';
	if (gs.d3)
		//Remove all edges.
		gs.d3.selectAll('line').remove();
}















