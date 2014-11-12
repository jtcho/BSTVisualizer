'use strict';

angular.module('bstvisualizerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'graph',
  'd3'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .when('/', '/unbalanced')
      .otherwise('/unbalanced');

    $locationProvider.html5Mode(true);
  });