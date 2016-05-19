

angular.module('activosInformaticosApp')
  .controller('AppCtrl', function ($scope, $mdDialog, $mdMedia, $mdToast, $filter, dataFactory) {

    $scope.people=[];

    dataFactory.getUsers( function (response) {
      $scope.people = response;

    });

    dataFactory.getAssetTypes( function (response) {
      $scope.assettypes = response;

    });

    dataFactory.getRelationTypes( function (response) {
      $scope.relationtypes = response;

    });

    $scope.toggleSidenav = function(menuId) {
      //$mdSidenav(menuId).toggle();
    };

    //----------users---------//

      $scope.goToPerson = function(person, event) {
          $mdDialog.show(
            $mdDialog.alert()
              .title('Navigating')
              //.content('Inspect ' + person)
              .content('Comentario ' + person.comment)
              .ariaLabel('Person inspect demo')
              .ok('Neat!')
              .targetEvent(event)
          );
      };

      $scope.doEditar = function(person, ev, $index) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          console.log($index);
          $mdDialog.show({
            locals: {
              person: person,
              borrar: $scope.doBorrar,
              indice: $index
            },
            controller: EditUserCtrl,
            templateUrl: '../../views/edit_user.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen
          })
            .then(function(user) {
              //$scope.status = 'Hiciste click en "' + answer + '".';
              if (user) {
                $scope.people[$index] = user;
              }
            }, function() {

            });

      };

      $scope.doBorrar = function(person, ev, indice) {
        //console.log(person);
        var confirm = $mdDialog.confirm()
            .title('¿Está seguro que desea borrar este usuario?')
            //.textContent('All of the banks have agreed to forgive you your debts.')
            .ariaLabel('Borrado de usuario')
            .targetEvent(ev)
            .ok('Aceptar')
            .cancel('Cancelar');
        $mdDialog.show(confirm)
          .then(function() {
            dataFactory.deleteUser(person,$mdDialog,$mdToast);
            $scope.people.splice(indice,1);
            //$scope.status = 'El usuario fue borrado';
          }, function() {
            $scope.status = 'No se realizaron cambios';
          });
      };

      $scope.showAddUser = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          controller: AddUserCtrl,
          templateUrl: '../../views/user.tmpl.html',
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


    //----------Types---------//

      $scope.showAddAssetType = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({

          controller: AddTypeCtrl,
          templateUrl: '../../views/add_asset_type.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(answer) {
          //$scope.status = 'Hiciste click en "' + answer + '".';
          if (answer) {
            console.log(answer);
            $scope.assettypes.push(answer);
          }

        }) //function() {

      };

      $scope.editAssetType = function (ev,type,$index) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          console.log($index);
          $mdDialog.show({
            locals: {
              type: type,
              indice: $index
            },
            controller: EditAssetTypeCtrl,
            templateUrl: '../../views/edit_asset_type.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen
          })
            .then(function(type) {
              //$scope.status = 'Hiciste click en "' + answer + '".';
              console.log($index);
              if (type) {
                console.log("edito");
                $scope.assettypes[$index] = type;
              }
            }, function() {

            });
      };

      $scope.goToType = function(type,ev,$index) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          locals: {
            type: type,
            indice: $index,
            editAssetType: $scope.editAssetType
          },
          controller: ShowTypeCtrl,
          templateUrl: '../../views/show_asset_type.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(answer) {
          //$scope.status = 'Hiciste click en "' + answer + '".';


        }) //function() {

      };


    //------Relation Types-------//

      $scope.showAddRelationType = function(ev) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({

            controller: AddRelationTypeCtrl,
            templateUrl: '../../views/add_relation_type.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen
          })
          .then(function(answer) {
            //$scope.status = 'Hiciste click en "' + answer + '".';
            if (answer) {
              console.log(answer);
              $scope.relationtypes.push(answer);
            }

          }) //function() {

        };

      $scope.editRelationType = function (ev,type,$index) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            //console.log($index);
            $mdDialog.show({
              locals: {
                type: type,
                borrar: $scope.deleteRelationType,
                indice: $index
              },
              controller: EditRelationTypeCtrl,
              templateUrl: '../../views/edit_relation_type.tmpl.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:false,
              fullscreen: useFullScreen
            })
              .then(function(type) {
                //$scope.status = 'Hiciste click en "' + answer + '".';
                //console.log($index);
                if (type) {
                  //console.log("edito");
                  $scope.relationtypes[$index] = type;
                }
              }, function() {

              });
        };

      $scope.goToRelationType = function(type,ev,$index) {
          var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
          $mdDialog.show({
            locals: {
              type: type,
              indice: $index,
              editRelationType: $scope.editRelationType
            },
            controller: ShowRelationTypeCtrl,
            templateUrl: '../../views/show_relation_type.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false,
            fullscreen: useFullScreen
          })
          .then(function(answer) {
            //$scope.status = 'Hiciste click en "' + answer + '".';


          }) //function() {

        };

      $scope.deleteRelationType = function(type, ev, indice) {
          //console.log(person);
          var confirm = $mdDialog.confirm()
              .title('¿Está seguro que desea borrar este tipo de relacion?')
              //.textContent('All of the banks have agreed to forgive you your debts.')
              .ariaLabel('Borrado de tipo de relacion')
              .targetEvent(ev)
              .ok('Aceptar')
              .cancel('Cancelar');
          $mdDialog.show(confirm)
            .then(function() {
              dataFactory.deleteRelationType(type,$mdDialog,$mdToast);
              $scope.relationtypes.splice(indice,1);
              //$scope.status = 'El usuario fue borrado';
            }, function() {
              $scope.status = 'No se realizaron cambios';
            });
        };

    //----------Controllers----------//

      function ShowTypeCtrl(type, editAssetType, indice, $scope, $mdDialog, $mdToast){
        $scope.type = type;
        $scope.indice = indice;
        $scope.editAssetType = editAssetType;
        $scope.ev = {};
        $scope.atributos = type.properties;


        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
      };

      function AddTypeCtrl($scope, $mdDialog, $mdToast) {
        $scope.asset_type = {};
        $scope.etapa = 1;
        $scope.listaNombreNodos = [];
        $scope.hayFinal = false;
        //$scope.estados = [];
        $scope.nombreDuplicado = false;
        $scope.nombreAtributoDuplicado = false;

        $scope.nodes = [{
          name: '',
          isInitial: true,
          isFinal: false,
          adjacents: [''],
          comment: ''
        }];

        $scope.tipos = [
          "String",
          "Boolean",
          "Integer",
          "Float",
          "List",
          "Date"
        ];

        $scope.properties = [
          { label: '1',
            name:'',
            type:'',
            required: false
               }
        ];

        $scope.changeFinal = function (valor) {
          $scope.hayFinal = valor;
        }

        $scope.compararNombre = function () {
          //console.log("comparando");
          for (i=0;i<$scope.nodes.length;i++) {
            for (j=0;j<$scope.nodes.length;j++) {
              if ($scope.nodes[j].name == $scope.nodes[i].name && i != j) {
                $scope.nombreDuplicado = true;
                return true;
              } else {
                $scope.nombreDuplicado = false;

              }
            }
          } return false;
        }

        $scope.compararAtributo = function () {
          //console.log($scope.properties);
          for (i=0;i<$scope.properties.length;i++) {
            for (j=0;j<$scope.properties.length;j++) {
              if ($scope.properties[j].name == $scope.properties[i].name && i != j) {
                $scope.nombreAtributoDuplicado = true;
                return true;
              } else {
                $scope.nombreAtributoDuplicado = false;

              }
            }
          } return false;
        }

        $scope.querySearch = function (query, indice_padre) {

              return $filter('filter')($scope.nodes, {name:query});
                  //deferred
        }

        $scope.addItem = function() {
              var n = $scope.properties.length;
              $scope.properties.push({ label: n+1, name:'', type:'',required:false });
        };

        $scope.removeItem = function(index) {
              $scope.properties.splice(index,1);
              $scope.compararAtributo();
        };

        $scope.addNode = function() {
              var n = $scope.nodes.length;
              //$scope.nodes.push({ name:'', isInitial:false, isFinal:false, adjacents: [{ enlace: ''}], comment: '' });
              $scope.nodes.push({ name:'', isInitial:false, isFinal:false, adjacents: [''], comment: '' });

              if ($scope.nodes[0].isFinal == true) {
                $scope.nodes[0].isFinal = false;
                $scope.hayFinal = false;
              }
        };

        $scope.removeNode = function(index) {
              if ( $scope.nodes[index].isFinal ) {
                $scope.hayFinal = false;
              }
              $scope.nodes.splice(index,1);
              $scope.compararNombre();

        };

        $scope.addLink = function(parent) {
              //console.log($scope.nodes[parent])
              var n = $scope.nodes[parent].adjacents.length;
              //$scope.nodes[parent].adjacents.push({ enlace: ''});
              $scope.nodes[parent].adjacents.push(' ');
        };

        $scope.removeLink = function(parent,index) {
              $scope.nodes[parent].adjacents.splice(index,1);
        };

        $scope.nextSelect = function () {
          ++$scope.etapa;
          if ($scope.etapa == 3) {
            //$scope.estados = $.extend(true,[],$scope.nodes);
            //console.log($scope.estados);
            for (i=0;i<$scope.nodes.length;i++) {
              $scope.listaNombreNodos[i] = $scope.nodes[i].name;
            }
          }
        }

        $scope.prevSelect = function () {
          --$scope.etapa;
        }

        $scope.pedirGraphviz = function () {
          $scope.graphLifeCycle = $scope.nodes;
          $scope.stateGraph = ' ';
          var auxGraph = $scope.graphLifeCycle[0].name.replace(" ","_");


          $scope.confGraph = 'digraph life_cycle { rankdir=LR; node [shape = doublecircle]; '+auxGraph+' '
          for (i=0;i<$scope.graphLifeCycle.length;i++) {
            if ($scope.graphLifeCycle[i].isFinal) {

              auxGraph = $scope.graphLifeCycle[i].name.replace(" ","_");
              $scope.confGraph += auxGraph+'; node [shape = circle]; ';
            }
            for (j=0;j<$scope.graphLifeCycle[i].adjacents.length;j++) {
              if (!$scope.graphLifeCycle[i].isFinal) {
                auxGraph = $scope.graphLifeCycle[i].name.replace(" ","_");
                var auxGraph2 = $scope.graphLifeCycle[i].adjacents[j].replace(" ","_");

                $scope.stateGraph += auxGraph+' -> '+auxGraph2+'; ';
              }
            }
          }
          $scope.stateGraph += " }";
          $scope.confGraph += $scope.stateGraph;
          console.log($scope.confGraph);
        }

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.answer = function(answer, type) {

          if (  answer == 'TipoActivo') {
            //var atributos = $scope.properties;
            type.properties = $scope.properties;
            type.lifeCycle = $scope.nodes;
            dataFactory.createAssetType( function (){
              $mdDialog.hide(type);
            }, type, $mdDialog, $mdToast);
          }
          else {
            $mdDialog.hide(null);
          }
        };

      };

      function EditAssetTypeCtrl(type, indice, $scope, $mdDialog, $mdToast) {

        $scope.update_type = $.extend(true,{},type);

        $scope.nombreDuplicado = false;
        $scope.nombreAtributoDuplicado = false;
        $scope.indice = indice;
        $scope.hayFinal = true;
        $scope.etapa = 1;

        $scope.tipos = [
          "String",
          "Boolean",
          "Integer",
          "Float",
          "List",
          "Date"
        ];

        $scope.addItem = function() {
              var n = $scope.update_type.properties.length;
              $scope.update_type.properties.push({ label: n+1, name:'', type:'',required:false });
            };

        $scope.removeItem = function(index) {
              $scope.update_type.properties.splice(index,1);
              $scope.compararAtributo();
            };

        $scope.addNode = function() {
              var n = $scope.update_type.lifeCycle.length;
              //$scope.nodes.push({ name:'', isInitial:false, isFinal:false, adjacents: [{ enlace: ''}], comment: '' });
              $scope.update_type.lifeCycle.push({ name:'', isInitial:false, isFinal:false, adjacents: [''], comment: '' });

             if ($scope.update_type.lifeCycle[0].isFinal == true) {
                $scope.update_type.lifeCycle[0].isFinal = false;
                $scope.hayFinal = false;
              }
        };

        $scope.removeNode = function(index) {
              if ( $scope.update_type.lifeCycle[index].isFinal ) {
                $scope.hayFinal = false;
              }
              $scope.update_type.lifeCycle.splice(index,1);
              $scope.compararNombre();

        };

        $scope.addLink = function(parent) {
              //console.log($scope.nodes[parent])
              var n = $scope.update_type.lifeCycle[parent].adjacents.length;
              //$scope.nodes[parent].adjacents.push({ enlace: ''});
              $scope.update_type.lifeCycle[parent].adjacents.push(' ');
        };

        $scope.removeLink = function(parent,index) {
              $scope.update_type.lifeCycle[parent].adjacents.splice(index,1);
        };

        $scope.nextSelect = function () {
          ++$scope.etapa;

        }

        $scope.prevSelect = function () {
          --$scope.etapa;
        }

        $scope.changeFinal = function (valor) {
          $scope.hayFinal = valor;
        }

        $scope.compararNombre = function () {
          //console.log("comparando");
          for (i=0;i<$scope.update_type.lifeCycle.length;i++) {
            for (j=0;j<$scope.update_type.lifeCycle.length;j++) {
              if ($scope.update_type.lifeCycle[j].name == $scope.update_type.lifeCycle[i].name && i != j) {
                $scope.nombreDuplicado = true;
                return true;
              } else {
                $scope.nombreDuplicado = false;

              }
            }
          } return false;
        }

        $scope.compararAtributo = function () {
          //console.log($scope.update_type.properties);
          for (i=0;i<$scope.update_type.properties.length;i++) {
            for (j=0;j<$scope.update_type.properties.length;j++) {
              if ($scope.update_type.properties[j].name == $scope.update_type.properties[i].name && i != j) {
                $scope.nombreAtributoDuplicado = true;
                return true;
              } else {
                $scope.nombreAtributoDuplicado = false;

              }
            }
          } return false;
        }

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.editar = function(update_type) {

          dataFactory.editAssetType( function (response){
              $mdDialog.hide(response);
            }, update_type, $mdDialog, $mdToast);
        };

      };

      function AddUserCtrl($scope, $mdDialog, $mdToast) {

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer, user) {

          if ( answer == 'Aceptar') {
            dataFactory.createUser( function (){
              $mdDialog.hide(user);
            }, user, $mdDialog, $mdToast);
          }
          else {
            $mdDialog.hide(null);
          }

        };
      };

      function EditUserCtrl(person, borrar,indice, $scope, $mdDialog, $mdToast) {

        $scope.update_person = $.extend({},person);
        $scope.borrar = borrar;
        $scope.indice = indice;

        $scope.callDel = function (indice) {
          //console.log(indice);
          ev = {};
          borrar(person,ev,indice);
        }

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer, user) {
          //console.log(user);
          if (  answer == 'Editar') {
            dataFactory.editUser( function (){
              $mdDialog.hide(user);

              //location.reload();
            }, user, $mdDialog, $mdToast);
          } else {
            $mdDialog.hide(null);
          }
        };
      };

      function ShowRelationTypeCtrl(type, editRelationType, indice, $scope, $mdDialog, $mdToast){
        $scope.relationType = type;
        $scope.indice = indice;
        $scope.editRelationType = editRelationType;
        $scope.ev = {};
        //$scope.atributos = type.properties;


        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
      };

      function AddRelationTypeCtrl($scope, $mdDialog, $mdToast) {

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer, type) {

          if ( answer == 'Aceptar') {
              //$mdDialog.hide(type);
            dataFactory.createRelationType( function (){
              $mdDialog.hide(type);
            }, type, $mdDialog, $mdToast);
          }
          else {
            $mdDialog.hide(null);
          }

        };
      };

      function EditRelationTypeCtrl(type, borrar,indice, $scope, $mdDialog, $mdToast) {

        $scope.update_relationType = $.extend({},type);
        $scope.borrar = borrar;
        $scope.indice = indice;

        $scope.callDel = function (indice) {
          ev = {};
          borrar(type,ev,indice);
        }

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer, type) {
          //console.log(user);
          if (  answer == 'Editar') {
              //$mdDialog.hide(type);
            dataFactory.editRelationType( function (){
              $mdDialog.hide(type);

              //location.reload();
            }, type, $mdDialog, $mdToast);
          } else {
            $mdDialog.hide(null);
          }
        };
      };

  });

  /*

  */
