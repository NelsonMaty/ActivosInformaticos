angular.module('activosInformaticosApp')
  .controller('ShowRelationCtrl', function ($stateParams,$previousState, $scope, $mdDialog, $mdMedia, $mdToast, $state, dataFactory) {
    $scope.relation = $stateParams.relation;
    $scope.sourceAssetId = $stateParams.assetId;
    //$scope.indice = indice;
    //$scope.editRelation = editRelation;
    //$scope.ev = {};

    if ($scope.relation.isCritical) {
      $scope.critico = "Sí";
    } else {
      $scope.critico = "No";
    }

    dataFactory.getAnAsset($scope.sourceAssetId, function (response) {

      $scope.sourceAsset = response;

    });

    dataFactory.getAnAsset($scope.relation.relatedAssetId, function (response) {

      $scope.relatedAsset = response;

    });

    $scope.goHome = function() {
      $state.go('usuario');
    };

    $scope.goAsset = function(asset) {
      $state.go('activo',{asset: asset});
      $previousState.set('verRelacion','relacion',{relation: $scope.relation, assetId: $scope.sourceAssetId});
    }

    $scope.goEditRelation = function() {
      $state.go('editRelacion',{relation: $scope.relation, assetId: $scope.sourceAssetId});
      $previousState.set('verRelacion','relacion',{relation: $scope.relation, assetId: $scope.sourceAssetId});
    }

    // $scope.hide = function() {
    //   $mdDialog.hide();
    // };
    // $scope.cancel = function() {
    //   $mdDialog.cancel();
    // };
});
