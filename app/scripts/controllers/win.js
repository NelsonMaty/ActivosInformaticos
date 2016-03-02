
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

    $scope.showAddAsset = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        locals: {
          assettypes: $scope.assettypes
          //borrar: {},
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
        if (user) {
          //console.log($scope.people.length);
          
          $scope.$apply(function() {
            //$scope.people.push(user);
          });
          //console.log($scope.people.length);
        }
      /*  $scope.status = 'Hiciste click en "' + answer + '".';
      }, function() {
        $scope.status = 'Hiciste click en cancel.';*/
        //console.log(answer);
        
      });
      
    };

    function DialogCtrl(assettypes, $scope, $mdDialog, $mdToast) {
      $scope.assettypes = assettypes;
      $scope.sel_type = {};

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      
      $scope.goToType = function(type, $event) {
        $scope.sel_type = type;
      };

      $scope.formly = function() {

      };

    };
    
  });


  
  
  