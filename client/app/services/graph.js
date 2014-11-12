'use strict';

/**
 * Function: findParentNode
 * ------------------------
 * Finds the parent node whose new child will be a node
 * with the val parameter.
 * Presumes that node is not null.
 */
var findParentNode = function(node, val) {
	console.log(val);
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
 * Function: drawNode
 * ------------------
 * Draws a given node type.
 */
var drawNode = function(node, val, gs) {
	//DRAWING INSTRUCTIONS.
	var scalingFactor = Math.sqrt(node.radius/gs.radius);
	var parentNode = node.parentNode;
	var d3 = gs.d3;
	var svg = gs.zoomLayer;

	svg.append('circle')
		.attr('cx', node.x)
		.attr('cy', node.y)
		.attr('r', node.radius)
		.attr('class', 'node')
		;
	svg.append('text').text(val)
		.attr('x', node.x)
		.attr('y', node.y)
		.attr('baseline-shift', (-17 * scalingFactor)+'px')
		.attr('text-anchor', 'middle')
		.attr('font-size', 50 * scalingFactor)
		;

	//Draw link to parent if any.
	if (parentNode)
		drawEdge(parentNode, node, gs);
}

/**
 * Function: drawEdge
 * ------------------
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
 .factory('NodeModel', ['d3Service', 'GraphService', function(d3Service, GraphService) {

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

			var xShift = this.radius*2;
			if (this.parentNode === gs.root)
				xShift *= 2;

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
		drawNode(this, val, gs, d3Service);
 	};

 	return Node;
 }])
 //Injectable GraphService.
 .service('GraphService', ['d3Service', function(d3Service, NodeModel) {
 	this.width = 1920;
 	this.height = 1080;
 	this.radius = 100;
 	this.nodes = [];
 	this.reg = /^[a-zA-Z]+$/;
 	this.root = '';

 	//Necessary to avoid scope conflicts with 'this.''
 	var graph = this;

	//D3 stuff.
	d3Service.d3().then(function(d3) {
		//Create canvas SVG
		var svg = d3.select('#graph_container').append('svg')
					.attr('width', '100%')
					//scale viewbox to container
					.attr('viewBox', '0 0 ' + graph.width + ' ' + graph.height)
					.attr('id', 'graph')
					.append('g');
		//Zoom behavior and scaling apply only to the above grouping.
		svg.call(d3.behavior.zoom().scaleExtent([1, 8]).on('zoom', function() {
			svg.attr('transform', 'translate(' + d3.event.translate + ')'+' scale(' + d3.event.scale + ')');
		}))
		;
		graph.zoomLayer = svg;

		// Draw overlay
		svg.append('rect')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('id', 'overlay');

		//Store d3 hook.
		graph.d3 = d3;
	});

 }])
 ;