
angular.module('activosInformaticosApp')
  .controller('AppCtrl', function ($scope, $mdDialog, $mdMedia) {
    //var vm = this;
    
    $scope.toggleSidenav = function(menuId) {
      //$mdSidenav(menuId).toggle();
    };

    $scope.goToPerson = function(person, event) {
        $mdDialog.show(
          $mdDialog.alert()
            .title('Navigating')
            .content('Inspect ' + person)
            .ariaLabel('Person inspect demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    };

    $scope.doSecondaryAction = function(event) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('Secondary Action')
          .content('Secondary actions can be used for one click actions')
          .ariaLabel('Secondary click demo')
          .ok('Neat!')
          .targetEvent(event)
      );
    };

    $scope.people = [
        { name: 'Janet Perkins', newMessage: true },
        { name: 'Mary Johnson', newMessage: false },
        { name: 'Peter Carlsson', newMessage: false }
      ];

    $scope.showAddUser = function(ev) {
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '../../views/user.tmpl.html',
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
    
    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }
    
});


 