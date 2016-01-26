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
  .config(function ($routeProvider, $httpProvider) {
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

      $httpProvider.defaults.headers.common = {};
      $httpProvider.defaults.headers.post = {};
      $httpProvider.defaults.headers.put = {};
      $httpProvider.defaults.headers.patch = {};
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

    dataFactory.createUser = function(callback,user){ 
      console.log(user); 
      
      /*var res = $http.post('http://172.16.248.194:3006/gonza', user);
      res.success(function(data, status, headers, config) {
        $scope.message = data;
      });
      res.error(function(data, status, headers, config) {
        alert( "failure message: " + JSON.stringify({data: data}));
      });*/ 


      /*return $http.post(urlWS + 'users', user)
        
        .success(function (data, status, headers) {
          //console.log(data);
          //var headers = headers();
          //var aux = headers
          //callback();
          alert("El usuario fué creado con éxito");
        })
        .error(function (error) {
          console.log(error);       
      }); */

      $http({
        method:"post",
        url:urlWS + 'users',
        data: {
            "user":user.name,
            "comment":user.comment
        }
        /*body: {
          "name": "user.name",
          "comment": "user.comment"
        },*/
        //headers: {
        //  'Content-Type':'application/json',
        //}
        //params: {user},
        //data: JSON.stringify(user),
          // {"name": user.name,
          //"comment": user.comment
          //user:user }
          
      })
        .success(function(data){
          alert("El usuario fue creado con éxito");
          callback();
      })
        .error(function(err){
            console.log(err);
            alert("no se pudo agregar a la base de datos");
      });
          
    };



    

    return dataFactory;
  }]);

  
