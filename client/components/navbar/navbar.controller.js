'use strict';

angular.module('bstvisualizerApp')
.controller('NavCtrl', function($scope, $location) {
	$scope.menu = [
		{
			'title': 'about',
			'slink': 'main.load.about'
		},
		{
			'title': 'unbalanced bst',
			'slink': 'main.load.unbalanced'
		},
		{
			'title': 'avl bst',
			'slink': 'main.load.avl'
		},
		{
			'title': 'llrb bst',
			'slink': 'main.load.llrb'
		}
	];

	$scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
});