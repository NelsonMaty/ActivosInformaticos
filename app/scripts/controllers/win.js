
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

    $scope.showFormly = function(formly_fields,typeid, listas) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          fields: formly_fields,
          typeid: typeid,
          listas: listas
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
          myassets: $scope.myassets,
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

    $scope.selectAsset = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          myassets: $scope.myassets
          //showformly: $scope.showFormly
          //fields: {}
        },
        controller: SelectAssetCtrl,
        templateUrl: '../../views/select_asset.tmpl.html',
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

    function SelectAssetCtrl(myassets,$scope, $mdDialog, $mdToast){
      $scope.assets = myassets;
      $scope.type_name = {};

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.goToAsset = function(asset, $event) {
        $scope.sel_asset = asset;
        dataFactory.getAnAssetType($scope.sel_asset.typeId, function (response) {
          $scope.type_name = response.name;

          
        });

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

        console.log($scope.sel_asset);
      };


    };

    function ShowAssetCtrl(asset, myassets, indice, editAsset, $scope, $mdDialog, $mdToast){
      $scope.asset = asset;
      $scope.assets = myassets;
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
      $scope.listas = [];

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
                hide: true,
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
            case 'List':
              console.log("case List");
              $scope.listas.push({
                name: atributos[i].name,
                elements: [{
                  content: ''
                } ]
              })
              
              aux = {
                key: atributos[i].name,
                type: 'input',
                hide: true,
                templateOptions: {
                  label: atributos[i].name,
                  placeholder: ''
                  
              }
                  
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
        $scope.showFormly($scope.formly_fields,sel_type._id, $scope.listas);
           
      };
       
    };

    function AddAssetCtrl(fields, typeid, listas, $scope, $mdDialog, $mdToast) {
      
      $scope.formly_fields = fields;
      $scope.typeid = typeid;
      $scope.listas = listas;
      $scope.names_list = [];
      $scope.adjuntos = [
        {
          url: ''
        }
      ];


      $scope.addItem = function(answer,parent_index) {
            console.log("parent_index:" + parent_index);
            //console.log($scope.listas[parent_index]);
            //$scope.lista_actual = $scope.listas[parent_index].elements;
            //console.log($scope.lista_actual);
            if (answer == 'lista') {
              $scope.listas[parent_index].elements.push({content:''});
              //$scope.ultimo = false;
            } else {
              $scope.adjuntos.push({url:''});  
            }
            
          };

      $scope.removeItem = function(answer,parent_index,index) {
            if (answer == 'lista') {
              if ($scope.listas[parent_index].elements.length>1){

                $scope.listas[parent_index].elements.splice(index,1);
              } 
            } else {
              $scope.adjuntos.splice(index,1);  
            }
            
          };

      dataFactory.getAnAssetType($scope.typeid, function (response) {
        //$scope.type_attributes = response.properties;

        for (i=0;i<response.properties.length;i++) {
          if (response.properties[i].type=="List") {
            $scope.names_list.push(response.properties[i].name);
          }
        }
      });


      $scope.newAsset = function(asset) {
        
        asset.attached = $scope.adjuntos;
        asset.typeId = $scope.typeid;

        for (i=0;i<$scope.listas.length;i++) {
          
          for (j=0;j<$scope.names_list.length;j++) {
            
            if(listas[i].name == $scope.names_list[j]) {
              asset[$scope.names_list[j]] = listas[i].elements;
            }
          }  
        }
        
        
        dataFactory.createAsset(function (response){
          
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

      $scope.adjuntos = $scope.update_asset.attached;


      $scope.addItem = function() {
            //var n = $scope.s.length;
            $scope.adjuntos.push({url:''});
          };

      $scope.removeItem = function(index) {
            $scope.adjuntos.splice(index,1);
          };

      
      

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
                  hide: true,
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
        asset.attached = $scope.adjuntos;
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


  
  
  