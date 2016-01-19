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
    'ngRoute',
    'ng-mfb'
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
  })

  .factory('dataFactory', ['$http',function($http){
      //var urlGeoObjectWS= 'http://nodejs-nodo1-dev.psi.unc.edu.ar:3005/';
      //var urlKunturWS = 'backend/';//'http://nodejs-nodo1-dev.psi.unc.edu.ar:3006/'
      //var urlKunturWS = 'http://172.16.248.229:8080/'
    var urlWS = 'http://localhost:8080/v1/'
    var dataFactory = {};

      //var lastResourceCreated = '';
      //var lastItemDeleted = {};

    dataFactory.getUsers = function(callback){
        //var pageSize = 30;
        //if(page)
        //    var offset = page * pageSize;
        //  else
        //    var offset = 0;
      //console.log("jola");  
      $http.get(urlWS + 'users')
        .then(function(response){
          //console.log(response);
          callback(response.data);
        },function(err){
          console.log(err);
      });
    };

    dataFactory.createUser = function(user){ 
      console.log(user); 
      return $http.post(urlWS + 'users', user)
        
        .success(function (data, status, headers) {
          //console.log(data);
          var headers = headers();
          //var aux = headers
          callback();
        })
        .error(function (error) {
          console.log(error);       
      });
          
    };

    /*dataFactory.createUniversity = function(callback, university){
            return $http.post(urlKunturWS + 'universities', university)
              .success(function (data, status, headers) {
                var headers = headers();
                var aux = headers['location'].split("/");
                callback(aux[aux.length-1]); //returned id
              })
              .error(function (error) {
                console.error(error);
              })
          };*/

    return dataFactory;
  }]);

  
