App.controller('detailsController', function($scope,$state, myfactory){
	myfactory.getverifyinventory().then(function(response){
		$scope.data = response;
	});

});