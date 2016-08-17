angular.module('activosInformaticosApp')
  .controller('EditPersonCtrl', function ($stateParams,$previousState, $scope, $mdDialog, $mdMedia, $mdToast, $state, dataFactory) {
    $scope.update_person = $.extend(true,{},$stateParams.person);

    $scope.goHome = function() {
      $state.go('usuario');
    };

    $scope.updatePerson = function(update_person) {
      // $state.go('editMember',{person: $scope.person});
      // $previousState.set('verPersona','person',{person: $scope.person});
      dataFactory.editPerson (function () {
          $scope.goHome();
        }, update_person, $mdDialog, $mdToast);
    };

    $scope.deletePerson = function(ev) {
      //console.log(person);
      var confirm = $mdDialog.confirm()
          .title('¿Está seguro que desea borrar este miembro?')
          //.textContent('All of the banks have agreed to forgive you your debts.')
          .ariaLabel('Borrado de miembro')
          .targetEvent(ev)
          .ok('Aceptar')
          .cancel('Cancelar');
      $mdDialog.show(confirm)
        .then(function() {
          dataFactory.deletePerson(function() {
            $scope.goHome();
          },$stateParams.person,$mdDialog,$mdToast);
          //$scope.people.splice(indice,1);
          //$scope.status = 'El usuario fue borrado';
        }, function() {
          //$scope.status = 'No se realizaron cambios';
        });
    };

    $scope.goBack = function() {
      var previous = $previousState.get();
      if (previous && previous.state.name == 'usuario') {
        $previousState.go();
        $previousState.forget();
      } else {
        $state.go('miembro',{person:$stateParams.person});
      }
    };

});
