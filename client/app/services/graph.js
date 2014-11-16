'use strict';

/**
 * Function: findParentNode
 * ------------------------
 * Finds the parent node whose new child will be a node
 * with the val parameter.
 * Presumes that node is not null.
 */
var findParentNode = function(node, val) {
	if (val < node.val) {
		if (node.left === '')
			return node;
		return findParentNode(node.left, val);
	}
	else {
		if (node.right === '')
			return node;
		return findParentNode(node.right, val);
	}
};

/**
 * Function: height
 * ----------------
 * Finds the height of the given node.
 */
 var height = function(node) {
 	if (! node)
 		return 0;
 	return Math.max(1 + height(node.left), 1 + height(node.right));
 }

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
};

/**
 * Function: determineInitialX
 * --------------------------
 */
var determineInitialX = function(root) {
	if (root) {
		determineInitialX(root.left);
		determineInitialX(root.right);

		if (! root.isLeftMost()) {
			root.X = root.getLeftSibling().X;
			root.mod = 0;
			// root.X = root.parentNode.X +
		}
		else
			root.X = 0;
		root.svg.select('#label').text(root.X);
	}
};

/**
 * Function: positionChildren
 * --------------------------
 */
var positionChildren = function(node) {
	if (node) {
		if (node.isLeaf()) {
			if (! node.isLeftMost())
				node.X = node.getLeftSibling().X + 1;
			else
				node.X = 0;
		}
		else {
			positionChildren(node.left);
			positionChildren(node.right);

			var mid = 0;

			//Only right node, shift right subtree by 1.
			if (! node.left) {
				node.X = node.right.X;
				addMods(node.right, 0.5);
			}
			//Only left node.
			else if (! node.right)
				mid = node.left.X + 1;
			//Both nodes.
			else
				mid = (node.left.X + node.right.X) / 2;

			if (! node.isLeftMost()) {
				node.X = node.getLeftSibling().X + mid + 1;
				node.mod += node.X - mid;
			}
			else
				node.X = mid;
		}
	}
};

/**
 * Function: addMods
 * --------------------------
 * Applies the root's mod transform on the subtree.
 */
var addMods = function(root, modSum) {
	if (root) {
		root.X += modSum;
		addMods(root.left, modSum + root.mod);
		addMods(root.right, modSum + root.mod);
		root.mod = 0;
	}
};

/**
 * Function: getLeftContour
 * -------------------------
 * Returns a list of the X values of the 
 * left-most nodes at each height level of the tree.
 */
var getLeftContour = function(node, contour, level) {
	if (node) {
		if (! contour)
			contour = [node.X];
		else if (contour.length < level + 1) 
			contour.push(node.X);
		else if (node.X < contour[level])
			contour[level] = node.X;

		contour = getLeftContour(node.left, contour, level+1);
		contour = getLeftContour(node.right, contour, level+1);
	}
	return contour;
}

/**
 * Function: getRightContour
 * -------------------------
 * Returns a list of the X values of the 
 * right-most nodes at each height level of the tree.
 */
var getRightContour = function(node, contour, level) {
	if (node) {
		if (! contour)
			contour = [node.X];
		else if (contour.length < level + 1) 
			contour.push(node.X);
		else if (node.X > contour[level])
			contour[level] = node.X;

		contour = getRightContour(node.left, contour, level+1);
		contour = getRightContour(node.right, contour, level+1);
	}
	return contour;
}

/**
 * Function: fixTree
 * -----------------
 * Re-draws the tree to satisfy certain aesthetic conditions.
 * Inspired largely by:
 * http://billmill.org/pymag-trees/
 */
var fixTree = function(root, gs) {
	determineInitialX(root);
	positionChildren(root);

	//A very succinct way of finding the minimum value of an array in JS.
	//http://stackoverflow.com/questions/2870015/math-min-apply0-array-why
	//We don't want to have negative X values!
	var minX = Math.min.apply(null, getLeftContour(root, '', 0));
	var rootMod = (minX < 0) ? minX * -1 : 0;

	addMods(root, rootMod, gs);

	fixOverlap(root, gs);

	drawNode(root, gs);
};

/**
 * Function: fixOverlap
 * --------------------
 * Fixes any overlapping components in the tree,
 * post-order.
 */
var fixOverlap = function(root, gs) {
	if (root) {
		fixOverlap(root.left, gs);
		fixOverlap(root.right, gs);
		if (root.left && root.right) {
			var leftContour = getLeftContour(root.right, '', 0);
			var rightContour = getRightContour(root.left, '', 0);
			var maxOverlap = 0, minLeft = 9999, maxRight = -1;
			for (var i = 0; i < Math.min(leftContour.length, rightContour.length); i++) {
				minLeft = Math.min(leftContour[i], minLeft);
				maxRight = Math.max(rightContour[i], maxRight);
				//Overlap
				if (minLeft - 0.5 <= maxRight) {
					maxOverlap = Math.max(maxOverlap, maxRight - minLeft + 1);
				}
			}
			if (maxOverlap) {
				addMods(root.right, maxOverlap, gs);
				root.X = (root.left.X + root.right.X)/2;
			}
		}
	}
};

/**
 * Function: drawNode
 * ------------------
 * Recursively draws a node and all of its children.
 */
var drawNode = function(root, gs) {
	if (root) {
		var newX = gs.width/2 + (root.X - gs.root.X) * gs.radius * 3;
		var newY = gs.radius + root.depth() * gs.radius * 3;
		root.label = root.X;
		// root.translateTo(newX, newY);
		root.oldX = root.posX;
		root.oldY = root.posY;
		root.posX = newX;
		root.posY = newY;

		var redraw = root.oldX != newX || root.oldY != newY;

		if (redraw) {
			root.draw(gs);
			//Clear edges.
			root.clearEdges();
			if (root.parentNode)
				root.drawEdge(root.parentNode, gs);
			if (root.left) {
				root.left.clearEdges();
				root.left.drawEdge(root, gs);
			}
			if (root.right) {
				root.right.clearEdges();
				root.right.drawEdge(root, gs);
			}
		}

		drawNode(root.left, gs);
		drawNode(root.right, gs);
	}
};


/**
 * Graph Module
 * Dependency for main app.
 */
 angular.module('graph', ['d3'])
 //Injectable GraphService.
 .service('GraphService', ['d3Service', function(d3Service) {
 	this.width = 1920;
 	this.height = 1080;
 	this.radius = 100;
 	this.nodes = [];
 	this.keys = [];
 	this.reg = /^[a-zA-Z]+$/;
 	this.root = '';

 	//Necessary to avoid scope conflicts with 'this.''
 	var graph = this;

	//D3 stuff.
	d3Service.d3().then(function(d3) {
		//Store d3 hook.
		graph.d3 = d3;
		//Initialize the canvas when d3 first loads.
		graph.drawCanvas();
	});

	/**
	 * Function: drawCanvas
	 * --------------------
	 * Creates the svg element and appends it to the page.
	 * Also draws the overlay rect for catching mouse events.
	 */
	this.drawCanvas = function() {
		var d3 = this.d3;
		var graph = this;
		//Create canvas SVG
		var svg = d3.select('#graph_container').append('svg')
					.attr('width', '100%')
					//scale viewbox to container
					.attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
					.attr('id', 'graph')
					.append('g')
					;
		//Zoom behavior and scaling apply only to the above grouping.
		svg.call(d3.behavior.zoom()
			.scaleExtent([0.25, 8])
			.on('zoom', function() {
			graph.zoomLayer.attr('transform', 'translate(' + d3.event.translate + ')'+' scale(' + d3.event.scale + ')');
		}))
		;

		this.zoomLayer = svg.append('g');

		// Draw overlay
		var zoomRect = svg.append('rect')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('id', 'overlay')
			;

	};

 }])
 ;