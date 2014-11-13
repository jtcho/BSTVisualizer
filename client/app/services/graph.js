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