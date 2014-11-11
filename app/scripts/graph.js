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
 	this.width = 1920;
 	this.height = 1080;
 	this.radius = 30;
 	this.nodes = [];

 	var graph = this;

	//Create our SVG drawing surface.
	d3Service.d3().then(function(d3) {
		var svg = d3.select('.container').append('svg')
					.attr('width', '100%')
					.attr('viewBox', '0 0 ' + graph.width + ' ' + graph.height)
					.attr('id', 'graph');
		svg.append('rect')
			.attr('width', '100%')
			.attr('height', '100%')
			.attr('id', 'graph_outline');
	});

 }])
 ;