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
 * Function: findNodeDepth
 * ------------------------
 */
var findNodeDepth = function(node) {
	if (! node.parentNode)
		return 0;
	return 1+findNodeDepth(node.parentNode);
}

/**
 * Function: drawNode
 * ------------------
 * Draws a given node type.
 * If the given node is already drawn,
 * redraws it.
 */
var drawNode = function(node, val, gs) {
	//DRAWING INSTRUCTIONS.
	//Sqrt scalingFactor or no.
	var scalingFactor = node.radius/gs.radius;
	var parentNode = node.parentNode;
	var d3 = gs.d3;

	//Remove old node.
	if (node.svg) {
		node.svg.remove();
	}

	var svg = gs.zoomLayer.append('g');
	node.svg = svg;

	svg.append('circle')
		.attr('cx', node.x)
		.attr('cy', node.y)
		.attr('r', node.radius)
		.attr('class', 'node')
		;
	svg.append('text').text(val)
		.attr('x', node.x)
		.attr('y', node.y + 17 * scalingFactor)
		.attr('text-anchor', 'middle')
		.attr('font-size', 50 * scalingFactor)
		;

	//Draw link to parent if any.
	if (parentNode)
		drawEdge(parentNode, node, gs);
}

/**
 * Function: removeNode
 * --------------------
 * Removes a node from the canvas.
 */
var removeNode = function(node) {
	if (node.svg)
		node.svg.remove();
}

/**
 * Function: drawEdge
 * ------------------
 * Draws an edge between two nodes.
 */
var drawEdge = function(node1, node2, gs) {
	var svg = gs.zoomLayer;

	//Math. Yay.
	var theta = Math.atan((node2.y - node1.y)/(node2.x - node1.x));
	var xo2 = node2.radius * Math.cos(theta);
	var yo2 = node2.radius * Math.sin(theta);
	var xo1 = node1.radius * Math.cos(theta);
	var yo1 = node1.radius * Math.sin(theta);
	var dir = (node1.val <= node2.val) ? 1 : -1;

	svg.append('line')
		.attr('class', 'link')
		.attr('x1', node1.x + dir*xo1)
		.attr('y1', node1.y + dir*yo1)
		.attr('x2', node2.x - dir*xo2)
		.attr('y2', node2.y - dir*yo2)
		;
}

/**
 * Graph Module
 * Dependency for main app.
 */
 angular.module('graph', ['d3'])
 .factory('NodeModel', ['GraphService', function(GraphService) {

 	/**
 	 * Instantiates a Node object with a given value.
 	 * Handles drawing and inserting the node in the 
 	 * GraphService's internal tree.
 	 */
 	var Node = function(val) {
 		var gs = GraphService;

 		//Instance Variables
 		this.x = 0;
 		this.y = 0;
 		this.val = val;
 		this.left = '';
 		this.right = '';
 		this.radius = 0;
 		this.height = 0;
		this.parentNode = '';
		this.svg = '';

 		//If no root defined, create.
		if (! gs.root) {
			gs.root = this;
			this.x = gs.width/2;
			this.y = 200;
			this.radius = gs.radius;
		}
		//Else, search for insertion node.
		else {
			this.parentNode = findParentNode(gs.root, val);
			this.parentNode.height++;
			this.radius = this.parentNode.radius * 0.7;
			this.y = this.parentNode.y + this.radius*3;

			//Exponential decay because drawing trees is hard.
			var xShift = this.radius*2*(1+Math.exp(-1 * findNodeDepth(this)/8));

			//Inserting on the left...
			if (val < this.parentNode.val) {
				this.parentNode.left = this;
				this.x = this.parentNode.x - xShift;
			}
			else {
				this.parentNode.right = this;
				this.x = this.parentNode.x + xShift;
			}

		}

		//Draw the node.
		drawNode(this, val, gs, gs.d3);
 	};

 	return Node;
 }])
 //Injectable GraphService.
 .service('GraphService', ['d3Service', function(d3Service, NodeModel) {
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
		//Create canvas SVG
		var svg = d3.select('#graph_container').append('svg')
					.attr('width', '100%')
					//scale viewbox to container
					.attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
					.attr('id', 'graph')
					.append('g');
		//Zoom behavior and scaling apply only to the above grouping.
		svg.call(d3.behavior.zoom().scaleExtent([1, 8]).on('zoom', function() {
			svg.attr('transform', 'translate(' + d3.event.translate + ')'+' scale(' + d3.event.scale + ')');
		}))
		;
		this.zoomLayer = svg;

		// Draw overlay
		svg.append('rect')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('id', 'overlay');
	};

 }])
 ;