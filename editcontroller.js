App.controller('editController', function($scope,myfactory,$rootScope){

   myfactory.getverifyinventory('3550').then(function(response){
     $scope.categories=response.Metadata.SubCategories;
     $rootScope.Metadata={};
     $rootScope.Metadata = response.Metadata;
     $scope.metadata=response.Metadata;
     $scope.allPackets = response.Safebox.Packets;
/*      $scope.tab1 = response.Safebox.Packets[0].Type.Id;*/
     

     angular.forEach(response.Safebox.Packets,function(pacVal,pacKey){
     	if(pacVal.Type.Id=='STORE'){
            $scope.tab1 = pacVal.Type.Id;
     		$scope.inventoryData=angular.copy(pacVal.Inventory);
     	}     	
     });
     angular.forEach(response.Safebox.Packets,function(pacVal,pacKey){
     	if(pacVal.Type.Id=='REPOSITORY'){
			pacVal.Inventory=$scope.inventoryData;
			$scope.RepositoryinventoryData=pacVal.Inventory;     
		}
     });

       $scope.$on('updateRepositoryData', function(e,rep) {
           $scope.RepositoryinventoryData = rep;
           $scope.$parent.getAllTabDataForValidation['filteredData']=$scope.RepositoryinventoryData;
           $scope.$parent.getAllTabDataForValidation['colDefs']=$scope.categories;
           myfactory.setRepositoryData($scope.RepositoryinventoryData);
       });

	 $scope.$parent.getAllTabDataForValidation['filteredData']=$scope.RepositoryinventoryData;
	 $scope.$parent.getAllTabDataForValidation['colDefs']=$scope.categories;

     myfactory.setRepositoryData($scope.RepositoryinventoryData);
     //$scope.inventoryData=angular.copy(response.Safebox.Packets[0].Inventory);
     //response.Safebox.Packets[1].Inventory=angular.copy(response.Safebox.Packets[0].Inventory);
     //$scope.RepositoryinventoryData=response.Safebox.Packets[1].Inventory;
     console.log("invdata", $scope.inventoryData );
     //$scope.finalInvData={};

    /*angular.forEach($scope.RepositoryinventoryData,function(invVal,invKey){
		if(invVal.SubCategory.Code && invVal.SubCategory.Code && invVal.SubCategory.Code != 'null'){
			if($scope.finalInvData.hasOwnProperty(invVal.SubCategory.Code)){
			    $scope.finalInvData[invVal.SubCategory.Code].push(invVal);
			}else{
				$scope.finalInvData[invVal.SubCategory.Code]=[invVal];
			}
		}
	});*/

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
   

    });
});
App.directive('gridData', function(){
	  return {
        restrict: 'E',
         scope: {
                data: '=',
               // selectedCode: '=',
                //subCategoryCode: '=',
                subCategories: '=',
                invData:'=',
               // allGridOptions: '='
            },
        templateUrl:'gridTable.html',
        controller:function($scope,$rootScope){
        	$rootScope.subCat=$scope.subCategories;       	
        	$scope.tabData=[];
        	/*$scope.$watch('selectedCode',function(nVal,oVal){
        		if(nVal){
        			angular.forEach($scope.filteredObject[$subCategoriesope.data.Category.Name],function(obj){
        				if(obj.Code == nVal){
        					
        				}
        			});
        		}
        	});*/
				$scope.gridOptions = {					
					    enablePaginationControls: true,
					    paginationPageSize: 10,
  					 // showGridFooter: true,
  					 // gridFooterTemplate: '<div><span style="float:right" ng-click="addRow()">+Add Additional Item</span></div>',
					  columnDefs: [
					      {
					        name: '',
					        field: 'selected',
					        width:'3%',
					        cellTemplate: '<input type="checkbox"/>'
					      }
					    ],
					    data:[]
			    };
		var gridObj = {};
        	
			angular.forEach($scope.data.ColumnDefinitions,function(value,index){
        		if(value.Label){
	          		var h = '<inventory-field type='+ value.ControlType +' value=' + value.ColumnName +' lookup-key=' + value.SourceAttributeKey + '></inventory-field>';	          		
	           	$scope.gridOptions.columnDefs.push({
	           		//'name':value.Label,
	           		//field:'Description1',
	           		field:value.ColumnName, // value.ColumnName as DESC_1 BUT NEED Description1..
	           		displayName:value.Label,
	                cellTemplate: h
	           	});//
	           
	           	gridObj['selected'] = false;	
	           //	gridObj[value.ColumnName] = value.ColumnName;
	           //	gridObj['code'] = $scope.subCategoryCode;
	       		}
	         });

        	  
		
		$scope.gridOptions.columnDefs.push({
					        name: ' ',
					        field: 'selected',
					        width:'3%',
					        cellTemplate: '<input type="checkbox"/>'
					      });
//		$scope.gridOptions.data.push(gridObj);
        	$scope.gridOptions.data=$scope.invData[$scope.data.Code];
		/*if(!$scope.allGridOptions.hasOwnProperty($scope.data.Category.Name)){
			$scope.allGridOptions[$scope.data.Category.Name] = [];
			
		}
			$scope.allGridOptions[$scope.data.Category.Name].push($scope.gridOptions);
			$scope.gridIndex = $scope.allGridOptions[$scope.data.Category.Name].length;
			$scope.name = $scope.data.Category.Name;
			console.log($scope.allGridOptions,$scope.gridIndex);*/
        },
        link: function(scope, element, attrs) {     	
			scope.addRow = function() {
			    alert('clicked123');
			};
		
				 
   	 }
};

});