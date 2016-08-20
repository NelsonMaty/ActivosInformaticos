
angular.module('activosInformaticosApp')
  .controller('AppController', function ($scope, $mdDialog, $mdSidenav, $timeout, $location, $mdMedia, $mdToast, $state, $previousState, dataFactory, NgTableParams) {


    $scope.toggleSidenav = function(menuId) {
    	//$mdSidenav(menuId).toggle();
    };
    //$scope.profundidad = null;
    var isSidenavOpen = false;
    $scope.assettypes = {};
    $scope.clicked_asset = {};
    $scope.clicked_relation = {};
    $scope.clicked_index = {};
    $scope.clicked = false;
    $scope.buscando = true;
    $scope.filterPerson = "";
    $scope.esFinal = false;

    var animationMenuExit = function(trigger, element){
        element = $(element);
            element.addClass('animated ' + 'bounceOutLeft');
            window.setTimeout( function(){

                    element.removeClass('animated ' + 'bounceOutLeft');
                    $scope.clicked = false;
                    $scope.clickedR = false;
                    $scope.$apply();
            }, 1100);

    }

    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
          });
      }
    }

    $scope.cerrarAvanzado = function () {
      isSidenavOpen = false;
      $mdSidenav('right').close()
        .then(function () {
        });
    }

    $scope.toggleRight = buildToggler('right');

    $scope.go = function() {
      //location.href = "0.0.0.0:9000/#/admin";
      // $location.path( path );
      $state.go('admin');
    }

    dataFactory.getAssetTypes( function (response) {
      $scope.assettypes = response;
    });

    dataFactory.getAssets( function (response) {
      $scope.myassets = response;
      $scope.buscando = false;
    });

    dataFactory.getPersons( function (response) {
      $scope.people = response;
    });

    $scope.clickAsset = function(asset,indice) {
      $scope.clicked_asset = asset;
      $scope.clicked_index = indice;
      if (!$scope.clicked && !isSidenavOpen) {
        $scope.toggleRight();
        isSidenavOpen = true;
      }
      $scope.clicked = true;
      dataFactory.getAnAssetType($scope.clicked_asset.typeId, function (response) {
        for (i=0;i<response.lifeCycle.length;i++) {
          if (response.lifeCycle[i].name == $scope.clicked_asset.estadoActual) {
            $scope.esFinal = response.lifeCycle[i].isFinal;
          }
        }
      });
    };

    $scope.clickedIcon= function(indice) {
      return($scope.clicked_index == indice);
    };

    $scope.clickClose = function () {
      if ($scope.clicked) {
        $scope.clicked_index = null;
        //$scope.toggleRight();
        // if (isSidenavOpen) $scope.cerrarAvanzado();
        animationMenuExit(null,$(".cerrar-menu-activo"),'bounceOutLeft');
      }
    };

    $scope.busqueda = function (string,avanzada,parametros) {

      $scope.buscando = true;

      if ( !avanzada ) {
        if (!string || string == " ") {
          dataFactory.getAssets( function (response) {
            $scope.myassets = response;
          });
          $scope.buscando = false;
        } else {
          dataFactory.searchString(string, function (response) {
            $scope.myassets = response;
            $scope.buscando = false;
          });
        }
      } else {
        var soloTipo = false;
        if (parametros.tags.$all.length==0) {
          delete parametros.tags;
        }
        var keys = Object.keys(parametros);

        if (keys.length<=2&&parametros.typeName) {
          soloTipo = true;

          for (i=0;i<keys.length;i++) {
            if (keys[i]!="name"&&keys[i]!="typeName") {

              soloTipo = false;

            }
          }
        }

        if (soloTipo) {
          // console.log("soloTipo");
          dataFactory.searchByType(parametros.name, parametros.typeName, function (response) {
            $scope.myassets = response;
            $scope.buscando = false;
          });
        } else {
          console.log(parametros);
          dataFactory.searchParams(parametros, function (response) {
            $scope.myassets = response;
            $scope.buscando = false;
          });
        }
      }
    }


    //-----------Assets-----------//
      $scope.showAdvSearch = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        //console.log(asset);
        $mdDialog.show({
          locals: {
            myassets: $scope.myassets,
            assettypes: $scope.assettypes

          },
          controller: AdvSearchCtrl,
          templateUrl: '../../views/show_advSearch.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(data) {
          //console.log(data);

          if (data) {
            $scope.busqueda(null,true,data);
          }

        });
      };

      $scope.showAddAsset = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          locals: {
            assettypes: $scope.assettypes,
            showformly: $scope.showFormly

          },
          controller: SelectTypeCtrl,
          templateUrl: '../../views/add_asset.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function() {

        });
      };

      $scope.showFormly = function(formly_fields,typeid, listas) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          locals: {
            fields: formly_fields,
            typeid: typeid,
            listas: listas,
            people: $scope.people
          },
          controller: AddAssetCtrl,
          templateUrl: '../../views/formly.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(asset) {
          if (asset) {
            $scope.myassets.push(asset);
          }
        });
      };

      $scope.goAsset = function(asset) {
        //console.log(asset);
        $state.go('activo', {asset: asset});
        $previousState.set('home','usuario');

      };

      // $scope.editAsset = function(ev,asset,indice,indexBusqueda) {
      $scope.editAsset = function(asset) {
        $state.go('editActivo', {asset: asset});
        $previousState.set('home','usuario');
      };

      $scope.deleteAsset = function(ev, asset, indice) {
        var confirm = $mdDialog.confirm()
            .title('¿Está seguro que desea borrar este activo?')
            .ariaLabel('Borrado de activo')
            .targetEvent(ev)
            .ok('Aceptar')
            .cancel('Cancelar');
        $mdDialog.show(confirm)
          .then(function() {
            dataFactory.deleteAsset(asset,$mdDialog,$mdToast);
            $scope.myassets.splice(indice,1);
            // if (indexBusqueda) {
            //   $scope.resultadoBusqueda.splice(indexBusqueda,1);
            // }
          }, function() {
            $scope.status = 'No se realizaron cambios';
          });
      };

    //-----------Relations-----------//

      $scope.addRelation = function(ev,etapa,asset) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          locals: {
            myassets: $scope.myassets,
            etapa: etapa,
            first: asset
          },
          controller: AddRelationCtrl,
          templateUrl: '../../views/add_relation.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(relation) {
          //console.log(user);
          if (relation) {
            console.log(relation);
            //$scope.assetRelations.push(relation);
            //console.log($scope.myassets);
          }

        });
      };

      //----------Person---------//

        $scope.goPerson = function(person) {

            $state.go('miembro', {person: person});
            $previousState.set('home','usuario');
        };

        $scope.goEditPerson = function(person) {
          $state.go('editMiembro',{person: person});
          $previousState.set('home','usuario');
        };

        $scope.showAddPerson = function(ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            controller: AddPersonCtrl,
            templateUrl: '../../views/add_person.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen
          })
          .then(function(user) {

            if (user) {
                $scope.people.push(user);
            }

          });
        };

    //-----------Controllers-----------//

      function AddPersonCtrl($scope, $mdDialog, $mdToast) {
        $scope.person = {};

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.addPerson = function(person) {

          dataFactory.createPerson( function (){
              $mdDialog.hide(person);
            }, person, $mdDialog, $mdToast);
        };
      };

      function AddRelationCtrl(myassets,etapa,first,$scope, $mdDialog, $mdToast){
        $scope.assets = myassets;
        $scope.etapa = etapa;
        $scope.relation = {};
        $scope.buscado = '';
        $scope.type_name = {};
        $scope.listas = [];
        $scope.names_list = [];
        $scope.sel_asset = null;
        $scope.clicked_index = null;
        $scope.relation.isCritical = false;
        $scope.added = [];
        $scope.first = first;
        $scope.relationTypeSelected = {};

        if (first) {
          $scope.added.push(first);
        }

        dataFactory.getRelationTypes( function (response) {
          $scope.relationTypes = response;
        });

        $scope.selectRelationType = function () {
          for (i=0;i<$scope.relationTypes.length;i++) {
            if ($scope.relationTypes[i]._id == $scope.relation.relationTypeId) {
              $scope.relationTypeSelected = $scope.relationTypes[i];
            }
          }
        }

        $scope.clickedIcon= function(indice) {
          return($scope.clicked_index == indice);
        };

        $scope.addSelected = function (sel_asset) {
          $scope.added.push(sel_asset);
          $scope.sel_asset = null;
          $scope.clicked_index = null;
          //delete $scope.assets[sel_asset.name];
          $scope.nextSelect();
          //console.log($scope.added);
        }

        $scope.removeSelected = function () {
          $scope.added.pop();
          $scope.sel_asset = null;
          $scope.clicked_index = null;
          //$scope.sel_asset.added = false;
          $scope.prevSelect();
          console.log($scope.added);
        }

        $scope.nextSelect = function () {
          ++$scope.etapa;
          if ($scope.etapa == 5) {
            $scope.rel_atributtes = Object.keys($scope.relation);
          }
        }

        $scope.prevSelect = function () {
          --$scope.etapa;
        }

        $scope.create = function (relation) {
          //relation.assets = $scope.added;
          relation.relatedAssetId = $scope.added[1]._id

          dataFactory.createRelation(function (response){

            $mdDialog.hide(relation);

          }, relation, $scope.added, $mdDialog, $mdToast);

        }

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.goToAsset = function(asset, $event, indice) {
          $scope.sel_asset = asset;
          $scope.clicked_index = indice;
          //$scope.sel_asset.added = false;
          $scope.listas = [];

          $scope.keys = Object.keys(asset);

          $scope.keys.splice($scope.keys.indexOf("name"),1);
          $scope.keys.splice($scope.keys.indexOf("comment"),1);
          $scope.keys.splice($scope.keys.indexOf("$$hashKey"),1);
          $scope.keys.splice($scope.keys.indexOf("attached"),1);
          $scope.keys.splice($scope.keys.indexOf("tags"),1);
          $scope.keys.splice($scope.keys.indexOf("estadoActual"),1);
          $scope.keys.splice($scope.keys.indexOf("stakeholders"),1);
          $scope.keys.splice($scope.keys.indexOf("_id"),1);
          $scope.keys.splice($scope.keys.indexOf("typeId"),1);


          if ($scope.keys.indexOf("__v")>=0) {

            $scope.b =$scope.keys.indexOf("__v");
            $scope.keys.splice($scope.b,1);

          }

          if ($scope.keys.indexOf("deleted")>=0) {

            $scope.a =$scope.keys.indexOf("deleted");
            $scope.keys.splice($scope.a,1);
          }


          dataFactory.getAnAssetType($scope.sel_asset.typeId, function (response) {
            $scope.type_name = response.name;
            $scope.asset_type = response;

            for (i=0;i<response.properties.length;i++) {
              if (response.properties[i].type=="List") {
                $scope.names_list.push(response.properties[i].name);

              }
            }

            for (i=0;i<$scope.names_list.length;i++) {
              for (j=0;j<$scope.keys.length;j++) {

                if($scope.names_list[i] == $scope.keys[j]) {

                  $scope.listas.push({
                    name: $scope.names_list[i],
                    elements: $scope.sel_asset[$scope.keys[j]]
                  });
                  $scope.keys.splice(j,1);

                }
              }
            }

          });

          dataFactory.getActualStateGraph( $scope.sel_asset._id, function (response) {
            $scope.lifeCycleGraph = response;
            //console.log($scope.lifeCycleGraph);
          });

          //console.log($scope.sel_asset);
        };

      };

      function SelectTypeCtrl(assettypes, showformly, $scope, $mdDialog, $mdToast) {
        $scope.assettypes = assettypes;
        $scope.showFormly = showformly;
        $scope.sel_atributos = [];
        $scope.listas = [];
        $scope.clicked_index = null;

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.clickedIcon= function(indice) {
          return($scope.clicked_index == indice);
        };

        $scope.goToType = function(type, $event, indice) {
          $scope.sel_type = type;
          $scope.clicked_index = indice;
          //console.log($scope.sel_type._id);
          dataFactory.getLifeCycleGraph( $scope.sel_type._id, function (response) {
            $scope.lifeCycleGraph = response;
            //console.log($scope.lifeCycleGraph);
          });

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
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'date',
                      label: '' + atributos[i].name,
                      required: true
                    //datepickerPopup: 'dd-MMMM-yyyy'
                    }
                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'date',
                      label: atributos[i].name
                    //datepickerPopup: 'dd-MMMM-yyyy'
                    }
                  };
                }

                break;
              case 'Boolean':
                //console.log("case boolean");
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'select',
                    templateOptions: {
                      label: '' + atributos[i].name,
                      options: [true,false],
                      required: true
                    }
                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'select',
                    templateOptions: {
                      label: atributos[i].name,
                      options: [true,false]

                    }
                  };
                }

                break;
              case 'Integer':
                //console.log("case boolean");
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: '' + atributos[i].name,
                      placeholder: '',
                      required: true
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
                    }
                  };
                } else {
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
                      label: '' + atributos[i].name,
                      placeholder: '',
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
                      placeholder: ''

                    }
                  };
                }

                break;
              case 'List':
                console.log("case List");
                $scope.listas.push({
                  name: atributos[i].name,
                  required: atributos[i].required,
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
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      label: '' + atributos[i].name,
                      placeholder: '',
                      required: true
                    }
                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      label: atributos[i].name,
                      placeholder: ''
                    }
                  };
                }

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

      function AddAssetCtrl(fields, typeid, listas, people, $scope, $mdDialog, $mdToast) {

        $scope.formly_fields = fields;
        $scope.asset = {};
        $scope.asset.tags = [];
        $scope.asset.stakeholders = [
          { personId: '',
            role: ''
          }
        ];
        $scope.typeid = typeid;
        $scope.listas = listas;
        $scope.estadoActual = null;
        $scope.type_prop = [];
        $scope.names_list = [];
        $scope.asset.attached = [
          {
            name: '',
            url: ''
          }
        ];
        $scope.people = people;

        dataFactory.getRoles(function (response) {
          $scope.roles = response;
        });

        $scope.addItem = function(answer,parent_index) {
              //console.log("parent_index:" + parent_index);
          switch (answer) {
            case 'lista':
              $scope.listas[parent_index].elements.push({content:''});
              break;
            case 'miembro':
              $scope.asset.stakeholders.push({personId:'',role:''});
              break;
            default:
              $scope.asset.attached.push({name:'',url:''});
              break;
          }
              // if (answer == 'lista') {
              //   $scope.listas[parent_index].elements.push({content:''});
              //   //$scope.ultimo = false;
              // } else {
              //   $scope.asset.attached.push('');
              // }

        };

        $scope.removeItem = function(answer,parent_index,index) {
              // if (answer == 'lista') {
              //   if ($scope.listas[parent_index].elements.length>1){
              //
              //     $scope.listas[parent_index].elements.splice(index,1);
              //   }
              // } else {
              //   $scope.asset.attached.splice(index,1);
              // }
              switch (answer) {
                case 'lista':
                  if ($scope.listas[parent_index].elements.length>1) $scope.listas[parent_index].elements.splice(index,1);
                  break;
                case 'miembro':
                  $scope.asset.stakeholders.splice(index,1);
                  $scope.verifPerson();
                  break;
                default:
                  $scope.asset.attached.splice(index,1);
                  $scope.verifUrl();
                  break;
              }
        };

        dataFactory.getAnAssetType($scope.typeid, function (response) {
          //$scope.type_attributes = response.properties;
          for (i=0;i<response.properties.length;i++) {
            if (response.properties[i].type=="List") {
              $scope.names_list.push(response.properties[i].name);
            }
          }

          $scope.estadoActual = response.lifeCycle[0].name;
        });


        $scope.newAsset = function(asset) {

          asset.typeId = $scope.typeid;
          asset.estadoActual = $scope.estadoActual;

          for (i=0;i<$scope.listas.length;i++) {
            for (j=0;j<$scope.names_list.length;j++) {
              if(listas[i].name == $scope.names_list[j]) {
                asset[$scope.names_list[j]] = listas[i].elements;
              }
            }
          }

          for (i=asset.attached.length-1;i>=0;i--) {
            if (asset.attached[i].name.length==0 && asset.attached[i].url.length==0) asset.attached.splice(i,1);
          }
          for (i=asset.stakeholders.length-1;i>=0;i--) {
            if (asset.stakeholders[i].personId.length==0 && asset.stakeholders[i].role.length==0) asset.stakeholders.splice(i,1);
          }

          dataFactory.createAsset(function (response){

            asset._id=response.id;
            $mdDialog.hide(asset);

          }, asset, $mdDialog, $mdToast);
        }

        $scope.verifUrl = function () {
          //console.log($scope.properties);
          for (i=0;i<$scope.asset.attached.length;i++) {
            if ($scope.asset.attached[i].name.length>0 && $scope.asset.attached[i].url.length==0 ) {
              $scope.urlVacio = true;
              return true;
            }
          }
          $scope.urlVacio = false;
          return false;
        };

        $scope.verifPerson = function () {
          //console.log($scope.properties);
          for (i=0;i<$scope.asset.stakeholders.length;i++) {
            if ($scope.asset.stakeholders[i].role.length>0 && $scope.asset.stakeholders[i].personId.length==0 ) {
              $scope.personVacio = true;
              return true;
            }
          }
          $scope.personVacio = false;
          return false;
        };

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

      };

      function AdvSearchCtrl(myassets, assettypes, $scope, $mdDialog, $mdToast) {
        $scope.myassets = myassets;
        $scope.assettypes = assettypes;
        $scope.activoBuscado = {
          tags: { $all: [] }
        };
        $scope.names_list = [];
        $scope.listas = [];
        $scope.selectedTypeId = "";
        $scope.selectedType = {};

        $scope.addItem = function(answer,parent_index) {
              //console.log("parent_index:" + parent_index);

              if (answer == 'lista') {
                $scope.listas[parent_index].elements.push({content:''});
                //$scope.ultimo = false;
              } else {
                $scope.asset.attached.push('');
              }

            };

        $scope.removeItem = function(answer,parent_index,index) {
              if (answer == 'lista') {
                if ($scope.listas[parent_index].elements.length>1){

                  $scope.listas[parent_index].elements.splice(index,1);
                }
              } else {
                $scope.asset.attached.splice(index,1);
              }

            };

        $scope.listarAtributos = function () {
          $scope.names_list = [];
          $scope.listas = [];

          dataFactory.getAnAssetType($scope.selectedTypeId,function (response) {
            var sel_type = response;
            $scope.selectedType = sel_type;
            function validateInt(value) {

              return /^\-?(0|[1-9]\d*)$/.test(value);
            }

            fields = [];

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
                        options: [true,false]

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
                      }
                    };

                  break;
                case 'Float':

                    aux = {
                      key: atributos[i].name,
                      type: 'input',
                      templateOptions: {
                        type: 'number',
                        label: atributos[i].name,
                        placeholder: ''

                      }
                    };


                  break;
                case 'List':
                  //console.log("case List");
                  $scope.listas.push({
                    name: atributos[i].name,
                    elements: [{
                      content: ''
                    } ]
                  })

                  $scope.names_list.push(atributos[i].name);

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

          });
        };

        $scope.buscar = function() {
          //$scope.hide();
          for (i=0;i<$scope.listas.length;i++) {
            for (j=0;j<$scope.names_list.length;j++) {
              if($scope.listas[i].name == $scope.names_list[j]) {

                for (k=$scope.listas[i].elements.length-1;k>=0;k--) {
                  if (!$scope.listas[i].elements[k].content) {
                    $scope.listas[i].elements.splice(k,1);
                  } else {
                      delete $scope.listas[i].elements[k].$$hashKey
                  }
                }
                if ($scope.listas[i].elements.length!=0) {
                  $scope.activoBuscado[$scope.names_list[j]] = {
                    $all: $scope.listas[i].elements
                  };
                }

              }
            }
          }
          if ($scope.selectedType) $scope.activoBuscado.typeName = $scope.selectedType.name;

          $mdDialog.hide($scope.activoBuscado);

        }

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
      }
  })

  .filter('selected', function() {
    return function (assets,selected) {
      //debugger;
      for (i=0;i<assets.length;i++) {
        if (assets[i] == selected[0]) {
          //console.log("if");
          assets.splice(i,1);
          break;
        }
      } return assets;
    }
  } );
