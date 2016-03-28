

angular.module('activosInformaticosApp')
  .controller('AppCtrl', function ($scope, $mdDialog, $mdMedia, $mdToast, dataFactory) {
    
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
        //console.log($index);
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
          $scope.assettypes.push(answer);
        }

      }) //function() {
        
    };

    $scope.goToType = function(type,ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          type: type
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

    function ShowTypeCtrl(type, $scope, $mdDialog, $mdToast){
      $scope.type = type;
      //$scope.indice = indice;
      //$scope.editAsset = editAsset;
      $scope.ev = {};
      //$scope.type_name = {};

      //$scope.keys = Object.keys(asset);
      console.log($scope.type);
     

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };
    
    function AddTypeCtrl($scope, $mdDialog, $mdToast) {

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

      $scope.addItem = function() {
            var n = $scope.properties.length;
            $scope.properties.push({ label: n+1, name:'', type:'',required:false });
          };

      $scope.removeItem = function(index) {
            $scope.properties.splice(index,1);
          };

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer, type) {

        if (  answer == 'TipoActivo') {
          var atributos = $scope.properties;
          dataFactory.createAssetType( function (){
            $mdDialog.hide(type);    
          }, type, atributos, $mdDialog, $mdToast);
        }
        else {
          $mdDialog.hide(null);
        }
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
    
});


 