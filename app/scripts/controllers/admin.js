

angular.module('activosInformaticosApp')
  .controller('AppCtrl', function ($scope, $mdDialog, $mdMedia, $mdToast, dataFactory) {
    
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
        $mdDialog.show({
          locals: {
            person: person,
            borrar: $scope.doBorrar
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
        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.doBorrar = function(person, ev) {
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
        //console.log(user);
        if (user) {
          //console.log($scope.people.length);
          
          $scope.$apply(function(user) {
            $scope.people.push(user);
          });
          //console.log($scope.people.length);
        }
      /*  $scope.status = 'Hiciste click en "' + answer + '".';
      }, function() {
        $scope.status = 'Hiciste click en cancel.';*/
        //console.log(answer);
        
      });
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
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
    
    function DialogController(person, borrar, $scope, $mdDialog, $mdToast) {
      

      //console.log(person);
      $scope.update_person = $.extend({},person);
      $scope.borrar = borrar;

      $scope.tipos = [
        "String",
        "Boolean",
        "Integer",
        "Float",
        "Date"
      ];

      $scope.radioData = [
        { label: '1', value: 1 }
      ];

      $scope.addItem = function() {
            var r = Math.ceil(Math.random() * 1000);
            $scope.radioData.push({ label: r, value: r });
          };

      $scope.removeItem = function() {
            $scope.radioData.pop();
          };

      $scope.callDel = function () {
        //console.log(person);
        borrar(person);
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
        
        } else
        {
          if (  answer == 'Editar') {
            dataFactory.editUser( function (){
              $mdDialog.hide(user);
            
            //location.reload();       
            }, user, $mdDialog, $mdToast);
          }
          else {
            $mdDialog.hide(null);
          }
        }

      };
    }
    
});


 