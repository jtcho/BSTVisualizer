'use strict';

/**
 * Type: UNode
 * ------------
 * Defines an unbalanced Binary Search Tree node.
 */
var UNode = function(val, gs) {

	Node.call(this, val, gs);

	if (! gs.root) {
		this.x = gs.width / 2;
		this.y = 200;
		this.parentNode = '';
		this.radius = gs.radius;
		gs.root = this;
	}
	else {
		this.parentNode = findParentNode(gs.root, val);
		this.radius = this.parentNode.radius * 0.7;
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
};

UNode.prototype = new Node();