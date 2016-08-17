angular.module('activosInformaticosApp')
  .controller('ShowPersonCtrl', function ($stateParams,$previousState, $scope, $mdDialog, $mdMedia, $mdToast, $state, dataFactory) {
    $scope.person = $stateParams.person;

    $scope.goHome = function() {
      $state.go('usuario');
    };

    $scope.goEditPerson = function() {
      $state.go('editMiembro',{person: $scope.person});
      $previousState.set('verPersona','person',{person: $scope.person});
    };

    $scope.goBack = function() {
      var previous = $previousState.get();
      if (previous && previous.state.name == 'activo') {
        $previousState.go();
        $previousState.forget();
      } else {
        $state.go('usuario');
      }
    };

});
