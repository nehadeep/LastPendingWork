

App.controller('reviewEditController', function($scope,myfactory,$state,$stateParams,$rootScope){
console.log($stateParams,"4::",$state.current.name);
 	$scope.tab = 1;

	$scope.setTab = function(tabId){
		$scope.tab = tabId;
		//$scope.$broadcast('updateFilterData');
	}
	$scope.isSet = function(tabId){
		return $scope.tab === tabId;
	}

   /* if ($state.current.name == 'editInventory.Step 1') {
        myfactory.getEditInventoryVM('3550').then(function (response) {
            console.log(response, "16::");
            angular.forEach(response.SafeBox.Packets, function (packet) {
                if (packet.Type.Id == 'LOC') {
                    $scope.originalStoreData = packet.Inventory;
                }
                if (packet.Type.Id == "REPSTRY") {
                    $scope.verifiedData = packet.Inventory;
                    ;
                    $scope.tab2 = packet.Type.Desc
                }
                if (packet.Type.Id == "MISNG") {
                    $scope.allUnverifiedData = packet.Inventory;
                    ;
                    $scope.tab3 = packet.Type.Desc
                }
            });
        });
    } else {*/
        $scope.allUnverifiedData = $scope.$parent.allUnverifiedData;
        $scope.verifiedData = $scope.$parent.verifiedData;
 //   }

    $scope.$on('updatestep2RepositoryData', function(e,rep) {
        $scope.verifiedData = rep;
        $scope.$parent.getAllTabDataForValidation['filteredData']=$scope.verifiedData;
        //$scope.$parent.getAllTabDataForValidation['colDefs']=$scope.categories;
    });
    $scope.$parent.getAllTabDataForValidation['filteredData']=$scope.verifiedData;
   /* $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
    	console.log(event, toState, toParams, fromState, fromParams,"17::");
            if(toState.name="detail3"){
                $scope.allUnverifiedDat=$scope.$parent.allUnverifiedData;
                $scope.verifiedData=$scope.$parent.verifiedData;
			}else if(toState.name="editInventory"){

			}
        }
	);*/


	myfactory.getverifyinventory('3550').then(function(response){
	    $scope.categories=response.Metadata.SubCategories;
        $rootScope.Metadata={};
        $rootScope.Metadata=response.Metadata;
        $rootScope.Metadata.SubCategories = response.Metadata.SubCategories;
     	$scope.metadata=response.Metadata;
        $scope.buildData();
        $scope.$parent.getAllTabDataForValidation['colDefs']=$scope.categories;
	});
	$scope.buildData = function(){
        $scope.filteredObject = {};
        angular.forEach($scope.categories,function(obj){
            if(!($scope.filteredObject.hasOwnProperty(obj.Category.Name))){
                $scope.filteredObject[obj.Category.Name] = [];
            }
            $scope.filteredObject[obj.Category.Name].push(obj);
        });
        var indexedTeams = [];

        $scope.playersToFilter = function() {
            indexedTeams = [];
            return $scope.categories;
        }

        $scope.filterTeams = function(player) {
            var teamIsNew = indexedTeams.indexOf(player.Category.Name) == -1;
            if (teamIsNew) {
                indexedTeams.push(player.Category.Name);
            }
            return teamIsNew;
        }
    }
});
