angular.module('activosInformaticosApp')
  .controller('EditAssetCtrl', function ($stateParams,$previousState, $scope, $mdDialog, $mdMedia, $mdToast, $state, dataFactory) {

    $scope.update_asset = $.extend(true,{},$stateParams.asset);
    $scope.indexEstadoActual = null;
    $scope.estadoFinal = null;
    $scope.estadoInicial = null;
    $scope.etapa = 1;
    $scope.siguienteEstado = null;
    $scope.estadoInexistente = true;
    $scope.asset_type = {};
    $scope.listas = [];
    $scope.volverInicial = false;
    $scope.actualStateGraph = {};

    // console.log($scope.update_asset);
    if($scope.update_asset.attached.length==0) $scope.update_asset.attached.push({name:'',url:''});

    dataFactory.getRoles(function (response) {
      $scope.roles = response;
    });

    dataFactory.getPersons( function (response) {
      $scope.people = response;
    });

    $scope.verifUrl = function () {
      //console.log($scope.properties);
      for (i=0;i<$scope.update_asset.attached.length;i++) {
        if ($scope.update_asset.attached[i].name.length>0 && $scope.update_asset.attached[i].url.length==0 ) {
          $scope.urlVacio = true;
          return true;
        }
      }
      $scope.urlVacio = false;
      return false;
    };

    $scope.addItem = function(answer,parent_index) {
          // if (answer == 'lista') {
          //   $scope.listas[parent_index].elements.push({content:''});
          // } else {
          //   $scope.update_asset.attached.push('');
          // }
          switch (answer) {
            case 'lista':
              $scope.listas[parent_index].elements.push({content:''});
              break;
            case 'miembro':
              $scope.update_asset.stakeholders.push({personId:'',role:''});
              break;
            default:
              $scope.update_asset.attached.push({name:'',url:''});
              break;
          }
    };

    $scope.removeItem = function(answer,parent_index,index) {

      // if (answer == 'lista') {
      //   if ($scope.listas[parent_index].elements.length>1){
      //     $scope.listas[parent_index].elements.splice(index,1);
      //   }
      // } else {
      //   $scope.update_asset.attached.splice(index,1);
      // }
      switch (answer) {
        case 'lista':
          if ($scope.listas[parent_index].elements.length>1) $scope.listas[parent_index].elements.splice(index,1);
          break;
        case 'miembro':
          $scope.update_asset.stakeholders.splice(index,1);
          break;
        default:
          $scope.update_asset.attached.splice(index,1);
          $scope.verifUrl();
          break;
      }
    };


    dataFactory.getAnAssetType ($scope.update_asset.typeId, function (response) {
      $scope.asset_type = response;
      $scope.fields = [
        {
                key: 'name',
                type: 'input',
                templateOptions: {
                  label: '* Nombre',
                  placeholder: $scope.update_asset.name,
                  required: true
                }

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
                }

        },
        {
                key: 'comment',
                type: 'textarea',
                templateOptions: {
                  label: 'Descripcion',
                  placeholder: $scope.update_asset.comment
                }

        }
      ];
      atributos = $scope.asset_type.properties;
      for (var i=0; i<$scope.asset_type.properties.length;i++) {

        switch(atributos[i].type) {
          case 'Date':
            var fecha = new Date($scope.update_asset[atributos[i].name]);
            // console.log(fecha);
            $scope.update_asset[atributos[i].name] = fecha;
            if (atributos[i].required == true) {
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'date',
                  label: '* ' + atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name],
                  required: true
                }
              };
            } else {
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'date',
                  label: atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name]
                }
              };
            }
            break;
          case 'Boolean':
            if (atributos[i].required == true) {
              aux = {
                key: atributos[i].name,
                type: 'select',
                templateOptions: {
                  label: '* ' + atributos[i].name,
                  options: [true,false],
                  placeholder: $scope.update_asset[atributos[i].name],
                  required: true
                }
              };
            } else {
              aux = {
                key: atributos[i].name,
                type: 'select',
                templateOptions: {
                  label: atributos[i].name,
                  options: [true,false],
                  placeholder: $scope.update_asset[atributos[i].name]
                }
              };
            }
            break;
          case 'Integer':
            if (atributos[i].required == true) {
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: '* ' + atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name],
                  required: true
                },
                validators: {
                  int: function($viewValue, $modelValue, scope) {
                    var value = $modelValue || $viewValue;
                    if (value) {
                      return validateInt(value);
                    }
                  }
                }
              };
            } else {
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'number',
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
                }
              };
            }
            break;
          case 'Float':
            if (atributos[i].required == true) {
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: '* ' + atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name],
                  required: true
                }
              };
            } else {
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  type: 'number',
                  label: atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name]
                }
              };
            }
            break;
          case 'List':
            $scope.listas.push({
              name: atributos[i].name,
              required: atributos[i].required,
              elements: $scope.update_asset[atributos[i].name]
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
            if (atributos[i].required == true) {
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  label: '* ' + atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name],
                  required: true
                }
              };
            } else {
              aux = {
                key: atributos[i].name,
                type: 'input',
                templateOptions: {
                  label: atributos[i].name,
                  placeholder: $scope.update_asset[atributos[i].name]
                }
              };
            }
            break;
        }
        $scope.fields.push(aux);
      }

      for (i=0; i<$scope.asset_type.lifeCycle.length;i++) {
        if ($scope.asset_type.lifeCycle[i].name == $scope.update_asset.estadoActual) {
          $scope.indexEstadoActual = i;
          $scope.estadoInexistente = false;
        }
        if ($scope.asset_type.lifeCycle[i].isFinal) {
          $scope.estadoFinal = $scope.asset_type.lifeCycle[i].name;
        }
        if ($scope.asset_type.lifeCycle[i].isInitial) {
          $scope.estadoInicial = $scope.asset_type.lifeCycle[i].name;
        }
      }
    });

    dataFactory.getActualStateGraph( $scope.update_asset._id, function (response) {
      $scope.actualStateGraph = response;

    });

    $scope.nextSelect = function () {
      ++$scope.etapa;
      if ($scope.etapa == 5) {
        $scope.rel_atributtes = Object.keys($scope.relation);
      }
    }

    $scope.prevSelect = function () {
      --$scope.etapa;
    }

    function validateInt(value) {
      return /^\-?(0|[1-9]\d*)$/.test(value);
    }

    $scope.confirmFinalAsset = function(ev, asset) {
      var confirm = $mdDialog.confirm()
          .title('¿Está seguro que desea avanzar al estado final de este activo? Esta acción es irreversible')
          .ariaLabel('Actualizar estado de activo')
          .targetEvent(ev)
          .ok('Aceptar')
          .cancel('Cancelar');
      $mdDialog.show(confirm)
        .then(function() {
          //console.log(asset);
          $scope.updateAsset(asset);

        }, function() {
          $scope.status = 'No se realizaron cambios';
        });
    };

    $scope.deleteAsset = function(ev) {
      var confirm = $mdDialog.confirm()
          .title('¿Está seguro que desea borrar este activo?')
          .ariaLabel('Borrado de activo')
          .targetEvent(ev)
          .ok('Aceptar')
          .cancel('Cancelar');
      $mdDialog.show(confirm)
        .then(function() {
          dataFactory.deleteAsset($stateParams.asset,function() {
            $scope.goHome();
          },$mdDialog,$mdToast);
          //$scope.myassets.splice(indice,1);
          // if (indexBusqueda) {
          //   $scope.resultadoBusqueda.splice(indexBusqueda,1);
          // }
          //
        }, function() {
          //$scope.status = 'No se realizaron cambios';
        });
    };

    $scope.updateAsset = function (asset) {
      // console.log(asset);
      if ($scope.siguienteEstado) {
        if ($scope.asset_type.lifeCycle[$scope.indexEstadoActual].isFinal)
        {
          asset.estadoActual = $scope.asset_type.lifeCycle[$scope.indexEstadoActual].name;
        } else {
            asset.estadoActual = $scope.siguienteEstado;
        }
      }

      if ($scope.volverInicial) {
        asset.estadoActual = $scope.estadoInicial;
      }

      for (i=asset.attached.length-1;i>=0;i--) {
        if (asset.attached[i].name.length==0 && asset.attached[i].url.length==0) asset.attached.splice(i,1);
      }

      dataFactory.editAsset (function (){

          $scope.goHome();
        }, asset, $mdDialog, $mdToast);

    };

    $scope.goHome = function() {
      $state.go('usuario');
    };

    $scope.goBack = function() {
      // $state.go('activo',{asset: $stateParams.asset});
      var previous = $previousState.get();
      if (previous && previous.state.name == 'usuario') {
        $previousState.go();
        $previousState.forget();
      } else {
        $state.go('activo',{asset: $stateParams.asset});
      }
    };

});
