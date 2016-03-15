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
    'formly',
    'formlyMaterialTemplate',
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

      /*$httpProvider.defaults.headers.common = {};
      $httpProvider.defaults.headers.post = {};
      $httpProvider.defaults.headers.put = {};
      $httpProvider.defaults.headers.patch = {};*/
  })



  .factory('dataFactory', ['$http',function($http){
      //var urlGeoObjectWS= 'http://nodejs-nodo1-dev.psi.unc.edu.ar:3005/';
      //var urlKunturWS = 'backend/';//'http://nodejs-nodo1-dev.psi.unc.edu.ar:3006/'
      //var urlKunturWS = 'http://172.16.248.229:8080/'
    //var urlWS = 'http://localhost:8080/v1/'
    var urlWS = 'http://localhost:10010/'
    var dataFactory = {};

    dataFactory.getUsers = function(callback){

      $http.get(urlWS + 'users')
        .then(function(response){
          //console.log(response);
          callback(response.data);
        },function(err){
          console.log(err);
      });
    };

    dataFactory.getAssetTypes = function(callback){

      $http.get(urlWS + 'assetTypes')
        .then(function(response){
          //console.log(response);
          callback(response.data);
        },function(err){
          console.log(err);
      });
    };

    dataFactory.createAssetType = function(callback,user,atributos,$mdDialog,$mdToast){
      console.log(user);
      console.log(atributos);

      $http({
        method:"post",
        url:urlWS + 'assetTypes',
        data: {
            "name":user.name,
            "comment":user.comment,
            "properties": atributos
        }

      })
        .success(function(data){
          //alert("El usuario fue creado con éxito");
          $mdToast.show(
            $mdToast.simple()
              .content('Se ha agregado el tipo de activo ' + user.name + ' a la base de datos')
              .position('top right')
              .hideDelay(3000)
          );

          callback();
      })
        .error(function(err){
          console.log(err);

          $mdToast.show(
            $mdToast.simple()
              .content('No se pudo agregar el tipo de activo a la base de datos')
              .position('top right')
              .hideDelay(3000)
          );
      });

    };

    dataFactory.createUser = function(callback,user,$mdDialog,$mdToast){
      console.log(user);

      $http({
        method:"post",
        url:urlWS + 'users',
        data: {
            "name":user.name,
            "comment":user.comment
        }

      })
        .success(function(data){
          //alert("El usuario fue creado con éxito");
          $mdToast.show(
            $mdToast.simple()
              .content('Se ha agregado el usuario ' + user.name + ' a la base de datos')
              .position('top right')
              .hideDelay(3000)
          );

          callback();
      })
        .error(function(err){
          console.log(err);

          $mdToast.show(
            $mdToast.simple()
              .content('No se pudo agregar el usuario a la base de datos')
              .position('top right')
              .hideDelay(3000)
          );
      });

    };

    dataFactory.editUser = function(callback,user,$mdDialog,$mdToast){
      console.log(user);

      $http({
        method:"put",
        url:urlWS + 'users/' + user._id,
        data: {
            //"name":user.name,
            "comment":user.comment
        }

      })
        .success(function(data){
          //alert("El usuario fue creado con éxito");
          $mdToast.show(
            $mdToast.simple()
              .content('Se ha modificado el usuario ' + user.name + ' en la base de datos')
              .position('top right')
              .hideDelay(3000)
          );

          callback();
      })
        .error(function(err){
          console.log(err);

          $mdToast.show(
            $mdToast.simple()
              .content('No se pudo modificar el usuario en la base de datos')
              .position('top right')
              .hideDelay(3000)
          );
      });

    };

    dataFactory.deleteUser = function(person,$mdDialog,$mdToast){
      //console.log(person);

      $http({
        method:"delete",
        url:urlWS + 'users/' + person._id,
        /*data: {
            "name":user.name,
            "comment":user.comment
        }*/

      })
        .success(function(data){
          //alert("El usuario fue creado con éxito");
          $mdToast.show(
            $mdToast.simple()
              //.content('Se ha eliminado el usuario ' + data.name + ' de la base de datos')
              .content(data.message)
              .position('top right')
              .hideDelay(3000)
          );

          //callback();
      })
        .error(function(err){
          console.log(err);

          $mdToast.show(
            $mdToast.simple()
              .content('No se pudo borrar el usuario de la base de datos')
              .position('top right')
              .hideDelay(3000)
          );
      });

    };

    dataFactory.getAssets = function(callback){

      $http.get(urlWS + 'assets')
        .then(function(response){
          //console.log(response);
          callback(response.data);
        },function(err){
          console.log(err);
      });
    };

    dataFactory.createAsset = function(callback,asset,$mdDialog,$mdToast){
      //console.log(asset);
      
      $http({
        method:"post",
        url:urlWS + 'assets',
        data: {
            asset
        }

      })
        .success(function(data){
          //alert("El usuario fue creado con éxito");
          $mdToast.show(
            $mdToast.simple()
              .content('Se ha creado el activo ' + asset.name )
              .position('top right')
              .hideDelay(3000)
          );

          callback();
      })
        .error(function(err){
          console.log(err);

          $mdToast.show(
            $mdToast.simple()
              .content('No se pudo crear el activo')
              .position('top right')
              .hideDelay(3000)
          );
      });

    };


    return dataFactory;
  }]);
