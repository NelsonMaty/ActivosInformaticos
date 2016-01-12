'use strict';

/**
 * @ngdoc overview
 * @name activosInformaticosApp
 * @description
 * # activosInformaticosApp
 *
 * Main module of the application.
 */
angular
  .module('activosInformaticosApp', [
    'ngAnimate',
    'ngResource',
    'ngMaterial',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AppCtrl', 
        controllerAs: 'admin'
      })
      .when('/win', {
        templateUrl: 'views/win.html',
        controller: 'AppController',
        controllerAs: 'win'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  
