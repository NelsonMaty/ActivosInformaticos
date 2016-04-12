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
        redirectTo: '/win'
      });

  })



  .factory('dataFactory', ['$http',function($http){
    var urlWS = 'http://localhost:10010/'
    var dataFactory = {};


      dataFactory.getGraph = function(script){

        $http({
            method:"post",
            url:'http://127.0.0.1:8081/' + 'graph',
            data: script

          })
            .success(function(data){
              //alert("El usuario fue creado con éxito");
              $mdToast.show(
                $mdToast.simple()
                  .content('Se envió el gráfico')
                  .position('top right')
                  .hideDelay(3000)
              );

              //callback();
          })
            .error(function(err){
              console.log(err);

              $mdToast.show(
                $mdToast.simple()
                  .content('No se pudo enviar el gráfico')
                  .position('top right')
                  .hideDelay(3000)
              );
          });

        };

    
    //----------Types---------//

      dataFactory.getAssetTypes = function(callback){

        $http.get(urlWS + 'assetTypes')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });
      };

      dataFactory.getAnAssetType = function(typeid,callback){

        $http.get(urlWS + 'assetTypes/' + typeid)
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });
      };

      dataFactory.createAssetType = function(callback,type,$mdDialog,$mdToast){
        //console.log(type);
        //console.log(atributos);

        $http({
          method:"post",
          url:urlWS + 'assetTypes',
          data: {
              "name":type.name,
              "comment":type.comment,
              //"properties": atributos
              "properties": type.properties
          }

        })
          .success(function(data){
            //alert("El usuario fue creado con éxito");
            $mdToast.show(
              $mdToast.simple()
                .content('Se ha agregado el tipo de activo ' + type.name + ' a la base de datos')
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

      dataFactory.editAssetType = function(callback,update_type,$mdDialog,$mdToast){
        console.log(update_type);

        $http({
          method:"put",
          url:urlWS + 'assetTypes/' + update_type._id,
          data: {
              "name":update_type.name,
              "comment":update_type.comment,
              "properties": update_type.properties
          }

        })
          .success(function(data){
            //alert("El usuario fue creado con éxito");
            $mdToast.show(
              $mdToast.simple()
                .content('Se ha modificado el tipo de activo ' + update_type.name )
                .position('top right')
                .hideDelay(3000)
            );

            callback(update_type);
        })
          .error(function(err){
            console.log(err);

            $mdToast.show(
              $mdToast.simple()
                .content('No se pudo modificar el tipo de activo')
                .position('top right')
                .hideDelay(3000)
            );
            callback(null);
        });

      };


    //----------Users---------//

      dataFactory.getUsers = function(callback){

        $http.get(urlWS + 'users')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
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


    //----------Assets---------//

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
          data: asset
          

        })
          .success(function(data){
            //alert("El usuario fue creado con éxito");
            $mdToast.show(
              $mdToast.simple()
                .content('Se ha creado el activo ' + asset.name )
                .position('top right')
                .hideDelay(3000)
            );
            console.log(data);
            callback(data);
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

      dataFactory.editAsset = function(callback,asset,$mdDialog,$mdToast){
        console.log(asset);

        $http({
          method:"put",
          url:urlWS + 'assets/' + asset._id,
          data: asset
          

        })
          .success(function(data){
            //alert("El usuario fue creado con éxito");
            $mdToast.show(
              $mdToast.simple()
                .content('Se ha modificado el activo ' + asset.name + ' en la base de datos')
                .position('top right')
                .hideDelay(3000)
            );

            callback();
        })
          .error(function(err){
            console.log(err);

            $mdToast.show(
              $mdToast.simple()
                .content('No se pudo modificar el activo en la base de datos')
                .position('top right')
                .hideDelay(3000)
            );
        });

      };

      dataFactory.deleteAsset = function(asset,$mdDialog,$mdToast){
        //console.log(person);

        $http({
          method:"delete",
          url:urlWS + 'assets/' + asset._id,
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
                .content('No se pudo borrar el activo en base de datos')
                .position('top right')
                .hideDelay(3000)
            );
        });

      };


    //----------Relations---------//

      dataFactory.getRelations = function(callback){

        $http.get(urlWS + 'relations')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });
      
      };

      dataFactory.createRelation = function(callback,relation,$mdDialog,$mdToast){
        console.log(relation);
        
        $http({
          method:"post",
          url:urlWS + 'relations',
          data: relation
          

        })
          .success(function(data){
            $mdToast.show(
              $mdToast.simple()
                .content('Se ha creado la relación entre ' + relation.assets[0].name + ' y ' + relation.assets[1].name )
                .position('top right')
                .hideDelay(3000)
            );
            console.log(data);
            callback(data);
        })
          .error(function(err){
            console.log(err);

            $mdToast.show(
              $mdToast.simple()
                .content('No se pudo crear la relacion entre ' + relation.assets[0].name + ' y ' + relation.assets[1].name)
                .position('top right')
                .hideDelay(3000)
            );
            callback(err);
        });

      };

    return dataFactory;
  }]);
