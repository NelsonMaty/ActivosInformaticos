angular.module('activosInformaticosApp')
  .controller('EditRelationCtrl', function ($stateParams,$previousState, $scope, $mdDialog, $mdMedia, $mdToast, $state, dataFactory) {
    // $scope.relation = $stateParams.relation;
    $scope.sourceAssetId = $stateParams.assetId;

    $scope.update_relation = $.extend({},$stateParams.relation);

    $scope.relationTypeSelected = {};


    dataFactory.getARelationType($scope.update_relation.relationTypeId, function (response) {
      $scope.relationTypeSelected = response;
    });

    dataFactory.getRelationTypes( function (response) {
      $scope.relationTypes = response;
    });

    $scope.selectRelationType = function () {
      for (i=0;i<$scope.relationTypes.length;i++) {
        if ($scope.relationTypes[i]._id == $scope.update_relation.relationTypeId) {
          $scope.relationTypeSelected = $scope.relationTypes[i];
        }
      }
    }

    dataFactory.getAnAsset($scope.sourceAssetId, function (response) {

      $scope.sourceAsset = response;

    });

    dataFactory.getAnAsset($scope.update_relation.relatedAssetId, function (response) {

      $scope.relatedAsset = response;

    });


    $scope.updateRelation = function (relation) {

      dataFactory.editRelation (function (){
          //$mdDialog.hide(relation);
          //$scope.assetRelations.splice(indice,1,relation);
          $state.go('activo',{asset: $scope.sourceAsset});
        }, relation, $scope.sourceAssetId, $mdDialog, $mdToast);

    };

    $scope.deleteRelation = function(ev) {
      //console.log(sourceAssetId);
      var confirm = $mdDialog.confirm()
          .title('¿Está seguro que desea borrar esta relacion?')
          .ariaLabel('Borrado de relacion')
          .targetEvent(ev)
          .ok('Aceptar')
          .cancel('Cancelar');
      $mdDialog.show(confirm)
        .then(function() {
          dataFactory.deleteRelation($stateParams.relation, $scope.sourceAssetId, function () {
              $state.go('activo',{asset: $scope.sourceAsset});
          } ,$mdDialog,$mdToast);
          //$scope.assetRelations.splice(indice,1);

        }, function() {
          //$scope.status = 'No se realizaron cambios';
        });
    };

    $scope.goHome = function() {
      $state.go('usuario');
    };

    $scope.goBack = function() {

      $state.go('relacion',{relation: $stateParams.relation, assetId: $scope.sourceAssetId});

    };
    
});
