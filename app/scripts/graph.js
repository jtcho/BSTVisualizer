'use strict';

/**
 *
 */
 angular.module('graph', ['d3'])
 .factory('NodeModel', ['d3Service', function(d3Service) {
 	var Node = function(pos, val) {
 		this.x = pos.x;
 		this.y = pos.y;
 		this.val = val;
 		this.UUID = '';

	 	//D3 stuff.
		d3Service.d3().then(function(d3) {
			var svg = d3.select('#graph');
			svg.append('circle')
				.attr('cx', pos.x)
				.attr('cy', pos.y)
				.attr('r', 30)
				.attr('class', 'node');
		});
 	};

 	return Node;
 }])
 .service('GraphService', ['d3Service', function(d3Service, NodeModel) {
 	this.width = 1000;
 	this.height = 800;
 	this.radius = 30;
 	this.nodes = [];

 	var graph = this;

 	//Mostly for testing.
 	for (var i = 0; i < 0; i++) {
 		this.nodes.push(new NodeModel({
 			x: Math.floor((Math.random() * this.width)), 
 			y: Math.floor((Math.random() * this.height))
 		}, 2));
	}

	//Create our SVG drawing surface.
	d3Service.d3().then(function(d3) {
		var svg = d3.select('body').append('svg')
					.attr('width', graph.width)
					.attr('height', graph.height)
					.attr('id', 'graph');
	});

 }])
 ;