

angular.module('activosInformaticosApp')
  .controller('AppCtrl', function ($scope, $mdDialog, $mdMedia, $mdToast, $filter, dataFactory) {
    
    $scope.people=[];
    
    dataFactory.getUsers( function (response) {
      $scope.people = response;

    });

    dataFactory.getAssetTypes( function (response) {
      $scope.assettypes = response;

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
        
        $scope.nodes = [{
          name: '',
          inicial: true,
          final: false,
          dirs: [{
            enlace: ''
          }]
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

        //$scope.nodes_names = [{}];
        //$scope.nodes_names[0].name = $scope.nodes[0].name;

        $scope.changeFinal = function (valor) {
          $scope.hayFinal = valor;
        }

        /*$scope.differentDir = function (indice_padre,estado.name) {
          console.log("entro if");
          if (nodes[indice_padre].name == seleccionado) {
            return true;
          } else {
            return false;
          }

        }*/

        /*$("div").focusout(function(){
            $(this).css("background-color", "#FFFFFF");
        });*/

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
        };

        $scope.addNode = function() {
              var n = $scope.nodes.length;
              $scope.nodes.push({ name:'', inicial:false, final:false, dirs: [{ enlace: ''}] });
              
             /* for (i=0;i<n;i++) {
                $scope.nodes_names[i].name = $scope.nodes[i].name;
              }*/
        };

        $scope.removeNode = function(index) {
              if ( $scope.nodes[index].final ) {
                $scope.hayFinal = false;
              }
              $scope.nodes.splice(index,1);

        };

        $scope.addLink = function(parent) {
              var n = $scope.nodes[parent].dirs.length;
              $scope.nodes[parent].dirs.push({ enlace: ''});
        };

        $scope.removeLink = function(parent,index) {
              $scope.nodes[parent].dirs.splice(index,1);
        };

        $scope.nextSelect = function () {
          ++$scope.etapa;
          if ($scope.etapa == 3) {
            //$scope.rel_atributtes = Object.keys($scope.relation);  
            for (i=0;i<$scope.nodes.length;i++) {
              $scope.listaNombreNodos[i] = $scope.nodes[i].name; 
            } 
          }
        }

        $scope.prevSelect = function () {
          --$scope.etapa;
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
            type.nodes = $scope.nodes;
            dataFactory.createAssetType( function (){
              $mdDialog.hide(type);    
            }, type, $mdDialog, $mdToast);
          }
          else {
            $mdDialog.hide(null);
          }
        };


      }

      function EditAssetTypeCtrl(type, indice, $scope, $mdDialog, $mdToast) {
        
        $scope.update_type = $.extend(true,{},type);

        $scope.indice = indice;

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
            };


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

      }

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
      }

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
      }
    
  })

  .filter('selected', function() {
    return function (nodes,selected) {
      //debugger;
      console.log("dentro del for");
      for (i=0;i<nodes.length;i++) {
        for (j=0;j<selected.length;j++) {
          if (nodes[i] == selected[j].enlace) {
            console.log("if");
            nodes.splice(i,1);
            //break;
          }
        }
        
      } return nodes;
    }
  } );


 