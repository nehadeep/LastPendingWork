App.directive('transactionProgression', transactionProgression);

function  transactionProgression(){
	return {
		restrict: "E",
		templateUrl : 'transactionProgression.html', 
		scope : {
			steps : "=",
			currentStep : "="
		}
	};
}