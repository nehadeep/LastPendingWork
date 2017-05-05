App.controller('DialogController',function ($scope, $mdDialog,items){
    $scope.catchInvalidColumns=items;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});

//var verifyInventory = angular.module('varifyinventory')


App.controller('verifyInventoryTransactionCtrl', function($scope,$state, myfactory, $sce, $rootScope,$mdDialog){
	myfactory.getverifyinventory('3550').then(function(response){

        $scope.wholeResp=response;
		$scope.selectActive = 0;
		$scope.itemsSteps = response.Workflow.Steps;
        $scope.isStepsLoad = true;
		$scope.total = $scope.itemsSteps.length - 1;
		$state.go('detail3.'+ $scope.itemsSteps[0].Name);
	/*	angular.forEach($scope.itemsSteps,function(obj){
			obj['text'] = $sce.trustAsHtml(obj.instructionHtml);
		})*/
	//	$scope.curentStep=1;
	});


/*$scope.itemsSteps = [{
	"id": 1, "title": "Edits"},
	{"id": 2, "title": "Review Edits"},
	{"id": 3, "title": "Confirmation"},

];*/

//var views=['home.detail.detail3.edits','home.detail.detail3.review','home.detail.detail3.confirmaton'];
//$state.go(views[$scope.selectActive]);
$scope.dataAfterstep1={};
$scope.mappingObj=myfactory.getMappingObject();
$scope.getAllTabDataForValidation={};
$scope.goToNextState = function(){
    $scope.catchInvalidColumns=[];
    if($scope.itemsSteps[$scope.selectActive].Name =='Step 1' || $scope.itemsSteps[$scope.selectActive].Name =='Step 2'){
        angular.forEach($scope.getAllTabDataForValidation.colDefs,function(colVal,colKey){
            var invalidcols=[];
            angular.forEach($scope.getAllTabDataForValidation.filteredData,function(filVal,filKey){
                if(filVal.SubCategory.Code==colVal.Code) {
                    if (!(filVal.ID < 0 && !filVal.IsVerified)){ //if mew row and is not verfied themm it won;t go to is required
                        angular.forEach(colVal.ColumnDefinitions, function (defVal, defKey) {
                            if (defVal.IsRequired && $scope.mappingObj.hasOwnProperty(defVal.ColumnName)) {
                                if (filVal[$scope.mappingObj[defVal.ColumnName]] === '' || filVal[$scope.mappingObj[defVal.ColumnName]] == null) {
                                    if(!invalidcols.includes(defVal.Label)) {
                                        invalidcols.push(defVal.Label);
                                        $scope.getAllTabDataForValidation.filteredData[filKey]['errorClass'] = true;
                                    }
                                }
                            }
                        });
                    }
                }
            });
            if(invalidcols.length){
                $scope.catchInvalidColumns.push({'table':colVal.Name,'column':invalidcols});
            }
        });
        if($scope.catchInvalidColumns.length){
            $mdDialog.show({
                templateUrl:'trash.html',
                ariaLabel:'name',
                controller: 'DialogController',
                clickOutsideToClose:true,
                locals: {
                    items: $scope.catchInvalidColumns
                }
            });
            return false;
        }
        $scope.repositoryData = myfactory.getRepositoryData();

        if($scope.itemsSteps[$scope.selectActive].Name =='Step 2'){
            angular.forEach($scope.verifiedData,function(verObj,verKey,verData){
                if(!verObj.isVerified){
                    var bool1=true;
                    angular.forEach($scope.allUnverifiedData,function(repObj,repKey,repData){
                        if(bool1 && verObj.ID==repObj.ID){
                            repObj.Quantity=repObj.Quantity+verObj.Quantity;
                            verData.splice(verKey,1);
                            bool1=false;
                        }
                    });
                    if(bool1){
                        var reverting=verData.splice(verKey,1);
                        $scope.allUnverifiedData.push(reverting[0]);
                    }
                }else{
                    console.log('else');
                }
            });
        }
        //if($scope.verifiedData == undefined) {
        (function(){
            var finalObj={};
            angular.forEach($scope.getAllTabDataForValidation.colDefs,function(catObj,catKey){
                var currArr=[];
                angular.forEach($scope.getAllTabDataForValidation.filteredData, function (dataObj,dataKey) {
                    if(catObj.Code==dataObj.SubCategory.Code){
                        if (dataObj.IsVerified) {
                            currArr.push(dataObj);
                        }
                    }
                });
                finalObj[catObj.Code]=currArr;
            });
            myfactory.setVerifiedData(finalObj);
        }())
            $scope.verifiedData = myfactory.getVerifiedData(); //checkd data we have

        //}
        /*angular.forEach($scope.verifiedData,function(obj,key,itm){
            if(obj.ID < 0 && !obj.IsVerified){
                itm.splice(key, 1);
            }else {
                var count = 0;
                angular.forEach($scope.verifiedData, function (selected) {
                    if (selected.ID == obj.ID) {
                        count++;
                    }
                });
                if (count == 0) {
                    $scope.allUnverifiedData.push(obj);
                }
            }
        });*/
        if($scope.itemsSteps[$scope.selectActive].Name =='Step 1') {

            $scope.allUnverifiedData = [];
            angular.forEach( $scope.repositoryData,function(obj,key,itm){
                if(obj.ID < 0 && !obj.IsVerified){
                    itm.splice(key, 1);
                }else {
                    var count = 0;
                    angular.forEach($scope.verifiedData, function (selected) {
                        if (selected.ID == obj.ID) {
                            count++;
                        }
                    });
                    if (count == 0) {
                        $scope.allUnverifiedData.push(obj);
                    }
                }
            });
            angular.forEach($scope.repositoryData, function (obj) {
                if (obj.Quantity < obj.OriginalQuantity && !obj.hasOwnProperty('mainRow')) {
                    var changedObj = angular.copy(obj);
                    changedObj['RelatedID'] = obj.ID;
                    changedObj['Quantity'] = obj.OriginalQuantity - obj.Quantity;
                    // changedObj['ID'] = -1;
                    $scope.allUnverifiedData.push(changedObj);
                }
             //   else if(obj.ID > 0 && obj.)

            });
        }
        myfactory.getverifyinventory('3550').then(function(response){
            $scope.wholeResp=response;
            angular.forEach(response.Safebox.Packets,function(packet){
                if(packet.Type.Id=='STORE'){
                    $scope.originalStoreData = packet.Inventory;
                }
                if(packet.Type.Id=='REPOSITORY'){
                    $scope.reposId=packet.Id;
                    packet.Inventory =  $scope.verifiedData;
                    $scope.tab2 = packet.Type.Id
                }
                if(packet.Type.Id=='MISSING'){
                    $scope.misngId=packet.Id;
                    packet.Inventory =  $scope.allUnverifiedData;
                    $scope.tab3 = packet.Type.Id
                }
            });
            $scope.newRepositoryData = response.Safebox.Packets;
        });
    }
/*    if($scope.itemsSteps[$scope.selectActive].Name =='Step 1'){
        $scope.dataAfterstep1={
            'allUnverifiedDataProp':angular.copy($scope.allUnverifiedData),
            'verifiedDataProp':angular.copy($scope.verifiedData)
        }
    }*/
    if($scope.selectActive < $scope.total){
        $scope.selectActive++;
    }
    else if($scope.selectActive == $scope.total){
        $scope.selectActive = 0;
    }
	$state.go('detail3.'+ $scope.itemsSteps[$scope.selectActive].Name);
}
    $scope.goBack = function () {
        if($scope.selectActive > 0){
            $scope.selectActive--;
        }
        $state.go('detail3.'+ $scope.itemsSteps[$scope.selectActive].Name);
    }
    $scope.showDetails = function(tabId){
        console.log('tabId',tabId);
        $mdDialog.show({
            templateUrl:'missingitemmodel.html',
            controller:'missingitemmodelCtrl as misd',
            clickOutsideToClose:true,
            locals: {
                packets: $scope.wholeResp.Safebox.Packets,
                packetId: tabId,
                shortMode:false
            },
            bindToController : true
        });

    }
});
/*
App.config(function ($stateProvider) {
    $stateProvider

      .state('edits', {
          url: '/edits',
          views: {
              'inventorydetail@': {
                  templateUrl: 'edits.html',
              }
          }

      })
  });
*/
   /* .state('home.about', {
        url: '/about',
        views: {
            'main@': {
                templateUrl: 'about.html',
            }
        },
        data: {
            displayName: 'About'
        }
    })
 .state('home.details2', {
        url: '/details2',
        views: {
            'main@': {
                templateUrl: 'details2.html',
            }
        },
        data: {
            displayName: 'detail'
        }
    })
    .state('home.detail', {
        url: '/:id',
        views: {
            'main@': {
                templateUrl: 'detail.html'
                //Sample controller declaration
                //controller: function ($scope, userId) {
                //    $scope.userId = userId;
                //}
            }
        },
        data: {
            displayName: '{{ id }}'
        },
        resolve: {
            id: function ($stateParams) {
                return $stateParams.id
            }
        }
    })
   .state('home.detail.detail3', {
        url: '/detail3',
        views: {
            'main@': {
                templateUrl: 'detail3.html',
            }
        },
        data: {
            displayName: 'detail3'
        }
    })
  .state('home.detail.detail4', {
        url: '/detail4',
        views: {
            'main@': {
                templateUrl: 'detail4.html',
            }
        },
        data: {
            displayName: 'detail4'
        }
    })
})*/
/*App.run(function ($state) {
    $state.go('home');
});
*/

