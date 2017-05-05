App.directive('transactionInstructions', transactionInstructions);

function transactionInstructions($sce){
	return {
		restrict: "E",
		templateUrl : 'transactionInstructions.html', 
		scope : {
			steps : "=", 
			currentStep : "="
		}, 
		link:function($scope, ele,atr){
			console.log($scope.steps,"steps",$scope.currentStep);
			$scope.$watch('currentStep', function(nValue,oValue){
				if(nValue){
                    $scope.sanitizedHtml = $sce.trustAsHtml($scope.steps[$scope.currentStep - 1].instructionHtml);
				}
			});

		}
	};
}