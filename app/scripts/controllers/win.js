
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
      //console.log(response);
      $scope.myassets = response;
      //console.log($scope.myassets);

    });

    $scope.showAddAsset = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          assettypes: $scope.assettypes,
          showformly: $scope.showFormly
          //fields: {}
        },
        controller: SelectTypeCtrl,
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

    $scope.showFormly = function(formly_fields,typeid) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          fields: formly_fields,
          typeid: typeid
        },
        controller: AddAssetCtrl,
        templateUrl: '../../views/formly.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: useFullScreen
      })
      .then(function(asset) {
        console.log("termine de agregar");
        if (asset) {
          console.log(asset);
          $scope.myassets.push(asset);
          //console.log($scope.myassets);
        }
        
        
      });
      
    };

    $scope.goAsset = function(ev,asset,$index) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      //console.log(asset);
      $mdDialog.show({
        locals: {
          asset: asset,
          indice: $index,
          editAsset: $scope.editAsset
          
        },
        controller: ShowAssetCtrl,
        templateUrl: '../../views/show_asset.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: useFullScreen
      })
      .then(function() {
        
        
      });
    };

    $scope.editAsset = function(ev,asset,$index) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      //console.log(asset);
      $mdDialog.show({
        locals: {
          asset: asset,
          myassets: $scope.myassets,
          indice: $index,
          deleteAsset: $scope.deleteAsset
          
        },
        controller: EditAssetCtrl,
        templateUrl: '../../views/edit_asset.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: useFullScreen
      })
      .then(function() {
        
        
      });
      
    };

    $scope.deleteAsset = function(ev, asset, indice) {
      //console.log(person);
      var confirm = $mdDialog.confirm()
          .title('¿Está seguro que desea borrar este activo?')
          //.textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Borrado de activo')
          .targetEvent(ev)
          .ok('Aceptar')
          .cancel('Cancelar');
      $mdDialog.show(confirm)
        .then(function() {
          dataFactory.deleteAsset(asset,$mdDialog,$mdToast);
          $scope.myassets.splice(indice,1);
          //$scope.status = 'El usuario fue borrado';
        }, function() {
          $scope.status = 'No se realizaron cambios';
        });
    };

    function ShowAssetCtrl(asset, indice, editAsset, $scope, $mdDialog, $mdToast){
      $scope.asset = asset;
      $scope.indice = indice;
      $scope.editAsset = editAsset;
      $scope.ev = {};
      $scope.type_name = {};


      $scope.keys = Object.keys(asset);
      //console.log($scope.keys);

      $scope.c =$scope.keys.indexOf("name");
      $scope.keys.splice($scope.c,1);
      $scope.d =$scope.keys.indexOf("comment");
      $scope.keys.splice($scope.d,1);
      $scope.e =$scope.keys.indexOf("$$hashKey");
      $scope.keys.splice($scope.e,1);
            
      //console.log($scope.keys.indexOf("__v"));
      if ($scope.keys.indexOf("__v")>=0) {
        //console.log($scope.asset.__v);
        $scope.b =$scope.keys.indexOf("__v");
        $scope.keys.splice($scope.b,1);
        
      }

      if ($scope.keys.indexOf("deleted")>=0) {
        //console.log($scope.asset.deleted);
        $scope.a =$scope.keys.indexOf("deleted");
        $scope.keys.splice($scope.a,1);
      }
      

      dataFactory.getAnAssetType($scope.asset.typeId, function (response) {
        $scope.type_name = response.name;
        });

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };

    function SelectTypeCtrl(assettypes, showformly, $scope, $mdDialog, $mdToast) {
      $scope.assettypes = assettypes;
      $scope.showFormly = showformly;

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      
      $scope.goToType = function(type, $event) {
        $scope.sel_type = type;
        //console.log(type);
      };

      $scope.doFormly = function(sel_type) {
        $scope.hide();
        //$scope.asset = {};
        function validateInt(value) {
          
          return /^\-?(0|[1-9]\d*)$/.test(value);
        }

        fields = [
              {
                key: 'name',
                type: 'input',
                templateOptions: {
                  label: 'Nombre',
                  placeholder: sel_type.name,
                  required: true
                }
              },
              {
                key: 'typeId',
                type: 'input',
                hide: true,
                templateOptions: {
                  label: 'Tipo',
                  placeholder: sel_type._id
                }
              },
              {
                key: 'attached',
                type: 'input',
                templateOptions: {
                  type:'url',
                  label: 'Url de información adjunta',
                  placeholder: 'http://'
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
          switch(atributos[i].type) {
            case 'Date':
              //console.log("case date");
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'date',
                  label: atributos[i].name
                  //datepickerPopup: 'dd-MMMM-yyyy'
                }
              };
              break;
            case 'Boolean':
              //console.log("case boolean");
              aux = {
                key: atributos[i].name,
                type: 'select',
                templateOptions: {
                  label: atributos[i].name,
                  options: ["True","False"]
                  
                }
              };
              break;
            case 'Integer':
              //console.log("case boolean");
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: atributos[i].name,
                  placeholder: ''
                  
                },
                validators: {
                  int: function($viewValue, $modelValue, scope) {
                    var value = $modelValue || $viewValue;
                    if (value) {
                      return validateInt(value);
                    } else {
                      return true;
                    }
                  }
                }/*,
                expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
              };
              break;
            case 'Float':
              //console.log("case boolean");
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: atributos[i].name,
                  placeholder: ''
                  
                }/*,
                expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
              };
              break;
            
            default:
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  label: atributos[i].name,
                  placeholder: ''
                }
              };
              break;
          }
          fields.push(aux);
          //console.log(aux);
        }
        $scope.formly_fields = fields;
        //console.log($scope.formly_fields);
        ev = {};
        //console.log($scope.sel_type._id); 
        $scope.showFormly($scope.formly_fields,sel_type._id);
           
      };
       
    };

    function AddAssetCtrl(fields, typeid, $scope, $mdDialog, $mdToast) {
      
      $scope.formly_fields = fields;
      $scope.typeid = typeid;
      //$scope.formly_form = {};

      $scope.newAsset = function(asset) {
        //console.log("id de tipo " + $scope.typeid);
        asset.typeId = $scope.typeid;
        //console.log("id de tipo" + asset.typeId);
        dataFactory.createAsset(function (response){
          //console.log($scope.sel_type.id);
          asset._id=response.id;
          $mdDialog.hide(asset);
              
        }, asset, $mdDialog, $mdToast);
      }

      $scope.hide = function() {
        $mdDialog.hide();
      };
      
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      
    };

    function EditAssetCtrl(asset, myassets, indice, deleteAsset, $scope, $mdDialog, $mdToast) {
      
      $scope.update_asset = $.extend({},asset);
      $scope.myassets = myassets;
      $scope.deleteAsset = deleteAsset;
      $scope.indice = indice;
      $scope.asset_type = {};
      
      /*$scope.options = {
        formState: {
                editable: '' // <-- this is bound to the firstName of the first field
              }
      };
      $scope.up_asset = {};
      //$scope.edit = {};*/

      dataFactory.getAnAssetType ($scope.update_asset.typeId, function (response) {
        
        $scope.asset_type = response;
        //console.log($scope.asset_type);
        $scope.fields = [
          {
                  key: 'name',
                  type: 'input',
                  templateOptions: {
                    label: 'Nombre',
                    placeholder: $scope.update_asset.name,
                    required: true
                  }/*,
                  expressionProperties: {
                    "templateOptions.disabled": "!options.formState.editable"
                    }*/
                  
          },
          {
                  key: 'typeId',
                  type: 'input',
                  hide: true,
                  templateOptions: {
                    label: 'Tipo',
                    placeholder: $scope.asset_type._id
                  }
          },
          {
                  key: 'attached',
                  type: 'textarea',
                  templateOptions: {
                    type:'url',
                    label: 'Url de información adjunta',
                    placeholder: 'http://'
                  }/*,
                  expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
          },
          {
                  key: 'comment',
                  type: 'textarea',
                  templateOptions: {
                    label: 'Descripcion',
                    placeholder: $scope.update_asset.comment
                  }/*,
                  expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
          }  
        ];
        atributos = $scope.asset_type.properties;
        for (var i=0; i<$scope.asset_type.properties.length;i++) {
          //console.log(atributos[i].name);

          switch(atributos[i].type) {
            case 'Date':
              //console.log("case date");

              
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'date',
                  label: atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name]
                  //datepickerPopup: 'dd-MMMM-yyyy'
                }/*,
                expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
              };
              break;
            case 'Boolean':
              //console.log("case boolean");
              aux = {
                key: atributos[i].name,
                type: 'select',
                templateOptions: {
                  label: atributos[i].name,
                  options: ["True","False"],
                  placeholder: $scope.update_asset[atributos[i].name]
                  
                }/*,
                expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
              };
              break;
            case 'Integer':
              //console.log("case boolean");
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  label: atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name]
                  
                },
                validators: {
                  int: function($viewValue, $modelValue, scope) {
                    var value = $modelValue || $viewValue;
                    if (value) {
                      return validateInt(value);
                    } 
                  }
                }/*,
                expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
              };
              break;
            case 'Float':
              //console.log("case boolean");
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name]
                  
                }/*,
                expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
              };
              break;
            default:
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  label: atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name]
                }/*,
                expressionProperties: {
                    "templateOptions.disabled": "!update_asset.editable"
                    }*/
                  
              };
              break;
          }
          $scope.fields.push(aux);
          //console.log(aux);
        }

      });

      function validateInt(value) {
        
        return /^\-?(0|[1-9]\d*)$/.test(value);
      }

      $scope.callDelete = function(indice) {
        ev = {};
        deleteAsset(ev,asset,indice);
      }

      $scope.updateAsset = function (asset) {
        dataFactory.editAsset (function (){
            $mdDialog.hide(asset);
            $scope.myassets.splice(indice,1,asset);
            //location.reload();       
          }, asset, $mdDialog, $mdToast);

      };

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      
      //keys = Object.keys(update_asset);

    };
    
  });


  
  
  