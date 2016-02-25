

angular.module('activosInformaticosApp')
  .controller('AppCtrl', function ($scope, $mdDialog, $mdMedia, $mdToast, dataFactory) {
    $scope.people=[];
    $scope.toggleSidenav = function(menuId) {
      //$mdSidenav(menuId).toggle();
    };

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
          controller: DialogController,
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
            //$scope.status = 'Hiciste click en cancel.';
          });
        /*$scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
      });*/
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
    
    dataFactory.getUsers( function (response) {
      $scope.people = response;

    });

    

    $scope.showAddUser = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          person: {},
          borrar: {},
        },
        controller: DialogController,
        templateUrl: '../../views/user.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: useFullScreen
      })
      .then(function(user) {
        
        if (user) {
          //console.log($scope.people.length);
          
          //$scope.$$phase || $scope.$apply(function(user) {
            
            $scope.people.push(user);
          //});
          //console.log($scope.people.length);
        }
      /*  $scope.status = 'Hiciste click en "' + answer + '".';
      }, function() {
        $scope.status = 'Hiciste click en cancel.';*/
        //console.log(answer);
        
      });
      
      /*scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });*/
    };

    $scope.showAddAssetType = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          person: {},
          borrar: {},
        },
        controller: DialogController,
        templateUrl: '../../views/add_asset_type.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: useFullScreen
      })
      .then(function(answer) {
        $scope.status = 'Hiciste click en "' + answer + '".';
      }, function() {
        $scope.status = 'Hiciste click en cancel.';
      });
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };
    
    function DialogController(person, borrar,indice, $scope, $mdDialog, $mdToast) {
      

      //console.log(person);
      $scope.update_person = $.extend({},person);
      $scope.borrar = borrar;
      $scope.indice = indice;

      $scope.tipos = [
        "String",
        "Boolean",
        "Integer",
        "Float",
        "Date"
      ];

      $scope.properties = [
        { label: '1', name:'', type:''  }
      ];

      $scope.addItem = function() {
            //var r = Math.ceil(Math.random() * 1000);
            var n = $scope.properties.length;
            $scope.properties.push({ label: n+1, name:'', type:'' });
          };

      $scope.removeItem = function(index) {
            //$scope.properties.pop($index);
            $scope.properties.splice(index,1);
          };

      $scope.callDel = function (indice) {
        console.log(indice);
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
        //$mdDialog.hide();

        //console.log(user);

        if ( answer == 'Aceptar') {
          dataFactory.createUser( function (){
            $mdDialog.hide(user);
            //$scope.people.push(user);
            
            //location.reload();       
          }, user, $mdDialog, $mdToast);
        
        } else {
          if (  answer == 'Editar') {
            dataFactory.editUser( function (){
              $mdDialog.hide(user);
            
            //location.reload();       
            }, user, $mdDialog, $mdToast);
          } else {
            if (  answer == 'TipoActivo') {
              var atributos = $scope.properties;
              dataFactory.createAssetType( function (){
                
              //console.log(user);
              //console.log($scope.properties);
                $mdDialog.hide(user);
              
              //location.reload();       
              }, user, atributos, $mdDialog, $mdToast);
            }
            else {
              $mdDialog.hide(null);
            }
          }
        }

      };
    }
    
});


 