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
    'ngMessages',
    'formly',
    'formlyMaterialTemplate',
    'ng-mfb',
    'ngTable'
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

    //---------Graph---------//

      dataFactory.getLifeCycleGraph = function(typeid,callback){

        $http.get(urlWS + 'assetTypes/' + typeid + '/LifeCycle/Graph')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });
      };

      dataFactory.getActualStateGraph = function(assetId,callback){

        $http.get(urlWS + 'assets/' + assetId + '/LifeCycle/Graph')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });
      };

      dataFactory.getRelationMap = function(assetId,callback){

        $http.get(urlWS + 'assets/' + assetId + '/relationsTree')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });
      };

      dataFactory.getPreviewGraph = function(confGraph,callback){

        $http({
          method:"post",
          url:urlWS + 'graph',
          data: {
                  img: confGraph
          }

        })
          .success(function(data){

            //console.log(data);
            callback(data);
        })
          .error(function(err){
            console.log(err);

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
              "properties": type.properties,
              "lifeCycle": type.lifeCycle
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
              "properties": update_type.properties,
              "lifeCycle": update_type.lifeCycle
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
        //console.log(asset);

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

      dataFactory.getAnAsset = function(id,callback){

        $http.get(urlWS + 'assets/' + id)
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });

      };


    //----------Relations---------//

      dataFactory.getAssetRelations = function(id,callback){

        $http.get(urlWS + 'assets/' + id + '/relations')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });

      };

      dataFactory.getIncomingAssetRelations = function(id,callback){

        $http.get(urlWS + 'assets/' + id + '/relations/incoming')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });

      };

      dataFactory.createRelation = function(callback,relation,added,$mdDialog,$mdToast){
        //console.log(relation);

        $http({
          method:"post",
          url:urlWS + 'assets/' + added[0]._id + '/relations',
          data: relation


        })
          .success(function(data){
            $mdToast.show(
              $mdToast.simple()
                .content('Se ha creado la relación entre ' + added[0].name + ' y ' + added[1].name )
                .position('top right')
                .hideDelay(3000)
            );
            console.log(data);
            callback();
        })
          .error(function(err){
            console.log(err);

            $mdToast.show(
              $mdToast.simple()
                .content('No se pudo crear la relacion entre ' + added[0].name + ' y ' + added[1].name)
                .position('top right')
                .hideDelay(3000)
            );
            callback(err);
        });

      };

      dataFactory.editRelation = function(callback,relation,sourceId,$mdDialog,$mdToast){
        //console.log(relation);

        $http({
          method:"put",
          url:urlWS + 'assets/' + sourceId + '/relations/' + relation.id,
          data: relation


        })
          .success(function(data){
            //alert("El usuario fue creado con éxito");
            $mdToast.show(
              $mdToast.simple()
                //.content('Se ha modificado la relacion ' + relation.name + ' en la base de datos')
                .content('Se ha modificado la relación exitosamente')
                .position('top right')
                .hideDelay(3000)
            );

            callback();
        })
          .error(function(err){
            console.log(err);

            $mdToast.show(
              $mdToast.simple()
                .content('No se pudo modificar la relación')
                .position('top right')
                .hideDelay(3000)
            );
        });

      };

      dataFactory.deleteRelation = function(relation, sourceId, $mdDialog,$mdToast){
        //console.log(person);

        $http({
          method:"delete",
          url:urlWS + 'assets/' + sourceId + '/relations/' + relation.id,
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
                .content('No se pudo borrar la relación')
                .position('top right')
                .hideDelay(3000)
            );
        });

      };

    //-------relationtypes-------//

    dataFactory.getRelationTypes = function(callback){

      $http.get(urlWS + 'relationTypes')
        .then(function(response){
          //console.log(response);
          callback(response.data);
        },function(err){
          console.log(err);
      });

    };

    dataFactory.getARelationType = function(id,callback){

      $http.get(urlWS + 'relationTypes/' + id)
        .then(function(response){
          //console.log(response);
          callback(response.data);
        },function(err){
          console.log(err);
      });

    };

    dataFactory.createRelationType = function(callback,type,$mdDialog,$mdToast){
      //console.log(user);

      $http({
        method:"post",
        url:urlWS + 'relationTypes',
        data: type




      })
        .success(function(data){
          //alert("El usuario fue creado con éxito");
          $mdToast.show(
            $mdToast.simple()
              .content('Se ha creado el tipo de relación ' + type._id )
              .position('top right')
              .hideDelay(3000)
          );

          callback();
      })
        .error(function(err){
          console.log(err);

          $mdToast.show(
            $mdToast.simple()
              .content('No se pudo crear el tipo de relación, ' + err.message)
              //.content(data.message)
              .position('top right')
              .hideDelay(3000)
          );
      });

    };

    dataFactory.editRelationType = function(callback,type,$mdDialog,$mdToast){
      //console.log(user);

      $http({
        method:"put",
        url:urlWS + 'relationTypes/' + type._id,
        data: type

      })
        .success(function(data){
          //alert("El usuario fue creado con éxito");
          $mdToast.show(
            $mdToast.simple()
              .content('Se ha modificado el tipo de relación ' + type.name )
              .position('top right')
              .hideDelay(3000)
          );

          callback();
      })
        .error(function(err){
          console.log(err);

          $mdToast.show(
            $mdToast.simple()
              .content('No se pudo modificar el tipo de relación ' + data.message)
              .position('top right')
              .hideDelay(3000)
          );
      });

    };

    dataFactory.deleteRelationType = function(type,$mdDialog,$mdToast){
      //console.log(person);

      $http({
        method:"delete",
        url:urlWS + 'relationTypes/' + type._id,
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
              .content('No se pudo borrar el tipo de relación')
              .position('top right')
              .hideDelay(3000)
          );
      });

    };


    return dataFactory;
  }]);
