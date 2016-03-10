
angular.module('activosInformaticosApp')
  .controller('AppController', function ($scope, $mdDialog, $location, $mdMedia, $mdToast, dataFactory) {
    //var vm = this;
    
    $scope.toggleSidenav = function(menuId) {
    	//$mdSidenav(menuId).toggle();
    };
    
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    $scope.go = function(path) {
      //location.href = "0.0.0.0:9000/#/admin";
      $location.path( path );
    }

    dataFactory.getAssetTypes( function (response) {
      $scope.assettypes = response;

    });

    dataFactory.getAssets( function (response) {
      console.log(response);
      $scope.myassets = response;
      console.log($scope.myassets);

    });

    $scope.showAddAsset = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          assettypes: $scope.assettypes,
          showformly: $scope.showFormly,
          fields: {}
        },
        controller: DialogCtrl,
        templateUrl: '../../views/add_asset.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: useFullScreen
      })
      .then(function() {
        //console.log(user);
        //$scope.showFormly(ev);
        
      });
      
    };

    $scope.showFormly = function(ev,formly_fields) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      //console.log(formly_fields);
      $mdDialog.show({
        locals: {
          assettypes: {},
          showformly: {},
          fields: formly_fields
        },
        controller: DialogCtrl,
        templateUrl: '../../views/formly.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: useFullScreen
      })
      .then(function() {
        //console.log(user);
        
        
      });
      
    };

    function DialogCtrl(assettypes, showformly, fields, $scope, $mdDialog, $mdToast) {
      $scope.assettypes = assettypes;
      $scope.showFormly = showformly;
      $scope.sel_type = {};
      $scope.formly_fields = fields;
      $scope.asset = {};

      $scope.newAsset = function(asset) {
        asset.typeId = $scope.sel_type.id;
        dataFactory.createAsset(function (){
          //console.log($scope.sel_type.id);
          $mdDialog.hide();
              
        }, asset, $mdDialog, $mdToast);
      }

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      
      $scope.goToType = function(type, $event) {
        $scope.sel_type = type;
        console.log(type);
      };

      $scope.doFormly = function(sel_type) {
        $scope.hide();
        //$scope.asset = {};
        fields = [
              {
                key: 'name',
                type: 'input',
                templateOptions: {
                  label: 'Nombre',
                  placeholder: sel_type.name
                }
              },
              {
                key: 'comment',
                type: 'textarea',
                templateOptions: {
                  label: 'Descripcion',
                  placeholder: ''
                }
              }  
              //Aca se cierra el array de objetos para formly
        ];

        //funciion para agregar dinamicamente los atributos al array fields
        atributos = sel_type.properties;

        for (var i=0; i<sel_type.properties.length;i++) {
          //console.log(atributos[i].name);
          aux = {
            key: atributos[i].name,
            type: 'input',
            templateOptions: {
              label: atributos[i].name,
              placeholder: ''
            }
          }
          fields.push(aux);
          //console.log(aux);
        }
        $scope.formly_fields = fields;
        //console.log($scope.formly_fields);
        ev = {};
        $scope.showFormly(ev,$scope.formly_fields);    
      };

          

    };
    
  });


  
  
  