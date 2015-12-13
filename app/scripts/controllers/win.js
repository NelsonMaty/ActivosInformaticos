
angular.module('activosInformaticosApp')
  .controller('AppController', function ($scope) {
    //var vm = this;
    
    $scope.toggleSidenav = function(menuId) {
    	//$mdSidenav(menuId).toggle();
    };
    
    $scope.activeTab;

    $scope.makeShift=function(e){
    	this.activeTab=e;
  	}
    
    $scope.isActive=function(f){
    	if(f==this.activeTab){
      		return true
    	}
  	}
  });

  /*.controller('shift_tabs', function($scope){
	$scope.activeTab;
	$scope.makeShift=function(e){
    	this.activeTab=e;
  	}
    $scope.isActive=function(f){
    	if(f==this.activeTab){
      		return true
    	}
  	}
  });*/


/*
var app = angular.module('activosInformaticosApp', ['ngMaterial']);

app.controller('AppController', function($mdSidenav) {
  var vm = this;

  vm.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

});*/