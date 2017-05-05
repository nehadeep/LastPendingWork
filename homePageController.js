App.controller('homePageController', function($scope,$state, myfactory){
	myfactory.getverifyinventory().then(function(response){
		$scope.data = response;
		$scope.safeBoxId = 'safeboxId:'+$scope.data.safebox.id
	});

});