angular.module('activosInformaticosApp')
  .controller('EditPersonCtrl', function ($stateParams,$previousState, $scope, $mdDialog, $mdMedia, $mdToast, $state, dataFactory) {
    $scope.update_person = $.extend(true,{},$stateParams.person);

    $scope.goHome = function() {
      $state.go('usuario');
    };

    $scope.updatePerson = function() {
      // $state.go('editMember',{person: $scope.person});
      // $previousState.set('verPersona','person',{person: $scope.person});
      dataFactory.editPerson (function (){
          $scope.goHome();
        }, asset, $mdDialog, $mdToast);
    };

    $scope.goBack = function() {
      var previous = $previousState.get();
      if (previous && previous.state.name == 'usuario') {
        $previousState.go();
        $previousState.forget();
      } else {
        $state.go('member',{person:$stateParams.person});
      }
    };

});
