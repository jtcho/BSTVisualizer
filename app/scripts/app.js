'use strict';

/**
 * @ngdoc overview
 * @name bstvisualizerApp
 * @description
 * # bstvisualizerApp
 *
 * Main module of the application.
 */
angular
  .module('bstvisualizerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'graph',
    'd3'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  });
