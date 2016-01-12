
angular.module('activosInformaticosApp')
  .controller('AppController', function ($scope, $mdDialog, $location) {
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

    
  });


  
  
  /*.controller('BasicDemoCtrl', function DemoCtrl($mdDialog) {
    var originatorEv;

    this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    this.notificationsEnabled = true;
    this.toggleNotifications = function() {
      this.notificationsEnabled = !this.notificationsEnabled;
    };

    this.redial = function() {
      $mdDialog.show(
        $mdDialog.alert()
          .targetEvent(originatorEv)
          .clickOutsideToClose(true)
          .parent('body')
          .title('Suddenly, a redial')
          .content('You just called a friend; who told you the most amazing story. Have a cookie!')
          .ok('That was easy')
      );

      originatorEv = null;
    };

    this.checkVoicemail = function() {
      // This never happens.
    };
  });*/
