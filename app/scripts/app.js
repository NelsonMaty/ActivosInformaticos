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
    'ui.router',
    'ngMessages',
    'formly',
    'formlyMaterialTemplate',
    'ng-mfb',
    'ngTable',
    'ct.ui.router.extras'
  ])
  // .config(function ($routeProvider, $httpProvider) {
  .config(function ($stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/usuario");
    // Now set up the states
    $stateProvider
      .state('admin', {
        url: "/administrador",
        templateUrl: "views/admin.html",
        controller: 'AppCtrl',
        controllerAs: 'admin'
      })
      // .state('state1.list', {
      //   url: "/list",
      //   templateUrl: "partials/state1.list.html",
      //   controller: function($scope) {
      //     $scope.items = ["A", "List", "Of", "Items"];
      //   }
      // })
      .state('usuario', {
        url: "/usuario",
        templateUrl: "views/win.html",
        controller: 'AppController',
        controllerAs: 'win'
      })
      .state('activo', {
        url: "/activo",
        templateUrl: "views/show_asset.tmpl.html",
        controller: 'ShowAssetCtrl',
        params: {
          asset: {}
        }
      })
      .state('editActivo', {
        url: "/edicionActivo",
        templateUrl: "views/edit_asset.tmpl.html",
        controller: 'EditAssetCtrl',
        params: {
          asset: {}
        }
      })
      .state('relacion', {
        url: "/relacion",
        templateUrl: "views/show_relation.tmpl.html",
        controller: 'ShowRelationCtrl',
        params: {
          relation: {},
          assetId: ""
        }
      })
      .state('editRelacion', {
        url: "/edicionRelacion",
        templateUrl: "views/edit_relation.tmpl.html",
        controller: 'EditRelationCtrl',
        params: {
          relation: {},
          assetId: ""
        }
      })
      .state('miembro', {
        url: "/miembro",
        templateUrl: "views/show_person.tmpl.html",
        controller: 'ShowPersonCtrl',
        params: {
          person: {}
        }
      })
      .state('editMiembro', {
        url: "/edicionMiembro",
        templateUrl: "views/edit_person.tmpl.html",
        controller: 'EditPersonCtrl',
        params: {
          person: {}
        }
      })
  //   $routeProvider
  //     .when('/', {
  //       templateUrl: 'views/login.html',
  //       controller: 'LoginCtrl',
  //       controllerAs: 'login'
  //     })
  //     .when('/admin', {
  //       templateUrl: 'views/admin.html',
  //       controller: 'AppCtrl',
  //       controllerAs: 'admin'
  //     })
  //     .when('/win', {
  //       templateUrl: 'views/win.html',
  //       controller: 'AppController',
  //       controllerAs: 'win'
  //     })
  //     .when('/main', {
  //       templateUrl: 'views/main.html',
  //       controller: 'MainCtrl',
  //       controllerAs: 'main'
  //     })
  //     .when('/about', {
  //       templateUrl: 'views/about.html',
  //       controller: 'AboutCtrl',
  //       controllerAs: 'about'
  //     })
  //     .otherwise({
  //       redirectTo: '/win'
  //     });
  //
  })

  .run(function ($rootScope, $state, $window, $timeout, $previousState) {
    $rootScope.$state = $state;

  })

  .factory('dataFactory', ['$http',function($http){
    var urlWS = 'http://localhost:10010/'
    var dataFactory = {};

    //---------Busqueda--------//

      dataFactory.searchString = function(string, callback) {

            $http.get(urlWS + 'assets?elasticSearch=' + escape(string) )
              .then(function(response){
                //console.log(soloTipo);
                callback(response.data);
              },function(err){
                console.log(err);
            });

      };

      dataFactory.searchByType = function(string,type,callback) {
        //console.log(string + " " + type);
        if (string) {
          $http.get(urlWS + 'assets?elasticSearch=' + escape(string) + '&assetTypeName=' + escape(type) )
            .then(function(response){
              //console.log("Tipo y palabra");
              callback(response.data);
            },function(err){
              console.log(err);
          });
        } else {
          //console.log(urlWS + 'assets?assetTypeName=' + escape(type) );
          $http.get(urlWS + 'assets?assetTypeName=' + escape(type) )
            .then(function(response){
              //console.log("tipo");
              callback(response.data);
            },function(err){
              console.log(err);
          });
        }


      };

      dataFactory.searchParams = function(parametros, callback) {

        delete parametros.typeName;
        var string = JSON.stringify(parametros);
        // console.log(string);
        // console.log(escape(string));

        // $http.get(urlWS + 'assets?patternSearch=%7B%22' + atributo + '%22%3A%22' + valor +'%22%7D' )
        $http.get(urlWS + 'assets?patternSearch=' + escape(string) )
          .then(function(response){
            callback(response.data);
          },function(err){
            console.log(err);
        });
      };

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

      dataFactory.getRelationMap = function(assetId,profundidad,callback){
        //console.log(profundidad);
        if (profundidad && profundidad>0) {

          $http.get(urlWS + 'assets/' + assetId + '/relationsTree?depth=' + profundidad )
            .then(function(response){
              //console.log(response);
              callback(response.data);
            },function(err){
              console.log(err);
          });
        } else {
          $http.get(urlWS + 'assets/' + assetId + '/relationsTree')
            .then(function(response){

              //console.log(response);
              callback(response.data);
            },function(err){
              console.log(err);
          });
        }

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


    // //----------Users---------//
    //
    //   dataFactory.getUsers = function(callback){
    //
    //     $http.get(urlWS + 'users')
    //       .then(function(response){
    //         //console.log(response);
    //         callback(response.data);
    //       },function(err){
    //         console.log(err);
    //     });
    //
    //   };
    //
    //   dataFactory.createUser = function(callback,user,$mdDialog,$mdToast){
    //     console.log(user);
    //
    //     $http({
    //       method:"post",
    //       url:urlWS + 'users',
    //       data: {
    //           "name":user.name,
    //           "comment":user.comment
    //       }
    //
    //     })
    //       .success(function(data){
    //         //alert("El usuario fue creado con éxito");
    //         $mdToast.show(
    //           $mdToast.simple()
    //             .content('Se ha agregado el usuario ' + user.name + ' a la base de datos')
    //             .position('top right')
    //             .hideDelay(3000)
    //         );
    //
    //         callback();
    //     })
    //       .error(function(err){
    //         console.log(err);
    //
    //         $mdToast.show(
    //           $mdToast.simple()
    //             .content('No se pudo agregar el usuario a la base de datos')
    //             .position('top right')
    //             .hideDelay(3000)
    //         );
    //     });
    //
    //   };
    //
    //   dataFactory.editUser = function(callback,user,$mdDialog,$mdToast){
    //     console.log(user);
    //
    //     $http({
    //       method:"put",
    //       url:urlWS + 'users/' + user._id,
    //       data: {
    //           //"name":user.name,
    //           "comment":user.comment
    //       }
    //
    //     })
    //       .success(function(data){
    //         //alert("El usuario fue creado con éxito");
    //         $mdToast.show(
    //           $mdToast.simple()
    //             .content('Se ha modificado el usuario ' + user.name + ' en la base de datos')
    //             .position('top right')
    //             .hideDelay(3000)
    //         );
    //
    //         callback();
    //     })
    //       .error(function(err){
    //         console.log(err);
    //
    //         $mdToast.show(
    //           $mdToast.simple()
    //             .content('No se pudo modificar el usuario en la base de datos')
    //             .position('top right')
    //             .hideDelay(3000)
    //         );
    //     });
    //
    //   };
    //
    //   dataFactory.deleteUser = function(person,$mdDialog,$mdToast){
    //     //console.log(person);
    //
    //     $http({
    //       method:"delete",
    //       url:urlWS + 'users/' + person._id,
    //       /*data: {
    //           "name":user.name,
    //           "comment":user.comment
    //       }*/
    //
    //     })
    //       .success(function(data){
    //         //alert("El usuario fue creado con éxito");
    //         $mdToast.show(
    //           $mdToast.simple()
    //             //.content('Se ha eliminado el usuario ' + data.name + ' de la base de datos')
    //             .content(data.message)
    //             .position('top right')
    //             .hideDelay(3000)
    //         );
    //
    //         //callback();
    //     })
    //       .error(function(err){
    //         console.log(err);
    //
    //         $mdToast.show(
    //           $mdToast.simple()
    //             .content('No se pudo borrar el usuario de la base de datos')
    //             .position('top right')
    //             .hideDelay(3000)
    //         );
    //     });
    //
    //   };

    //----------Persons---------//

      dataFactory.getPersons = function(callback){
        $http.get(urlWS + 'persons')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });
      };

      dataFactory.getRoles = function(callback){
        $http.get(urlWS + 'roles')
          .then(function(response){
            //console.log(response);
            callback(response.data);
          },function(err){
            console.log(err);
        });
      };

      dataFactory.createPerson = function(callback,person,$mdDialog,$mdToast){
        // console.log(user);
        $http({
          method:"post",
          url:urlWS + 'persons',
          data: person
        })
          .success(function(data){
            //alert("El usuario fue creado con éxito");
            $mdToast.show(
              $mdToast.simple()
                .content('Se ha creado el miebro ' + person.name + '')
                .position('top right')
                .hideDelay(3000)
            );
            callback();
        })
            .error(function(err){
              console.log(err);
              $mdToast.show(
                $mdToast.simple()
                  .content('No se pudo crear el miembro')
                  .position('top right')
                  .hideDelay(3000)
              );
        });
      };

      dataFactory.editPerson = function(callback,person,$mdDialog,$mdToast){
          // console.log(user);
        $http({
          method:"put",
          url:urlWS + 'persons/' + person._id,
          data: person
        })
        .success(function(data){
          //alert("El usuario fue creado con éxito");
          $mdToast.show(
            $mdToast.simple()
              .content('Se ha modificado el miembro ' + person.name + ' exitosamente')
              .position('top right')
              .hideDelay(3000)
          );
          callback();
        })
        .error(function(err){
          console.log(err);
          $mdToast.show(
            $mdToast.simple()
              .content('No se pudo modificar el miembro')
              .position('top right')
              .hideDelay(3000)
          );
        });
      };

      dataFactory.deletePerson = function(callback,person,$mdDialog,$mdToast){
          $http({
            method:"delete",
            url:urlWS + 'persons/' + person._id,

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
            callback();
          })
          .error(function(err){
            console.log(err);
            $mdToast.show(
              $mdToast.simple()
                .content('No se pudo borrar el miembro')
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
                .content('Se ha modificado el activo ' + asset.name + ' exitosamente')
                .position('top right')
                .hideDelay(3000)
            );

            callback();
        })
          .error(function(err){
            console.log(err);

            $mdToast.show(
              $mdToast.simple()
                .content('No se pudo modificar el activo')
                .position('top right')
                .hideDelay(3000)
            );
        });

      };

      dataFactory.deleteAsset = function(asset,callback,$mdDialog,$mdToast){
        //console.log(person);

        $http({
          method:"delete",
          url:urlWS + 'assets/' + asset._id,


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
            //$state.go('usuario');
            callback();
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

      dataFactory.getAssetVersions = function(id,callback){

        $http.get(urlWS + 'assets/' + id +'/versions')
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

      dataFactory.deleteRelation = function(relation, sourceId, callback, $mdDialog,$mdToast){
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

            callback();
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
