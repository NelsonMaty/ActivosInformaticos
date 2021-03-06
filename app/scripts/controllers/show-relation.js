angular.module('activosInformaticosApp')
  .controller('ShowRelationCtrl', function ($stateParams,$previousState, $scope, $mdDialog, $mdMedia, $mdToast, $state, dataFactory) {
    $scope.relation = $stateParams.relation;
    $scope.sourceAssetId = $stateParams.assetId;
    // console.log($scope.relation);
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

    dataFactory.getARelationType($scope.relation.relationTypeId, function(response){
      $scope.relationType = response;
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

    $scope.goBack = function() {

      // var previous = $previousState.get();
      // if (previous && previous.state.name == 'activo') {
      //   $previousState.go();
      //   $previousState.forget();
      // } else {
      //   $state.go('usuario');
      // }
      $state.go('activo',{asset: $scope.sourceAsset});
    };

    // $scope.hide = function() {
    //   $mdDialog.hide();
    // };
    // $scope.cancel = function() {
    //   $mdDialog.cancel();
    // };
});
