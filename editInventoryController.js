App.controller('editInventoryController', function($scope,$state, myfactory, $sce, $rootScope,$mdDialog) {

    myfactory.getEditInventoryVM('3550').then(function (response) {
        $scope.selectActive = 0;
        $scope.wholeResp=response;
        $scope.itemsSteps = response.Workflow.Steps;
        $scope.isStepsLoad = true;
        $scope.total = $scope.itemsSteps.length - 1;
        $state.go('editInventory.'+ $scope.itemsSteps[0].Name);

        angular.forEach(response.SafeBox.Packets,function(packet){
            if(packet.Type.Id=="REPSTRY"){
                $scope.reposId=packet.Id;
                $scope.verifiedData =  packet.Inventory;
                $scope.originalInventoryData=angular.copy(packet.Inventory);
                $scope.tab2 = packet.Type.Desc
            }
            if(packet.Type.Id=="MISNG"){
                $scope.misngId=packet.Id;
                $scope.allUnverifiedData =  packet.Inventory;
                $scope.originalUnverifiedData=angular.copy(packet.Inventory);
                $scope.tab3 = packet.Type.Desc
            }
        });

    });
    $scope.originalInventoryData=[];
    $scope.originalUnverifiedData=[];
    $scope.mappingObj=myfactory.getMappingObject();
    $scope.getAllTabDataForValidation={};
    $scope.goToNextState = function() {
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


            //if($scope.verifiedData == undefined) {
                var finalObj={};
                angular.forEach($scope.getAllTabDataForValidation.colDefs,function(catObj,catKey){
                    var currArr=[];
                    angular.forEach($scope.getAllTabDataForValidation.filteredData, function (dataObj,dataKey) {

                        if(catObj.Code==dataObj.SubCategory.Code){
                            //if (dataObj.IsVerified) {
                                currArr.push(dataObj);
                           // }
                        }
                    });
                    finalObj[catObj.Code]=currArr;
                });
                myfactory.setVerifiedData(finalObj);
            $scope.verifiedData = myfactory.getVerifiedData(); //checkd data we have
            //}

    angular.forEach($scope.verifiedData, function (verObj, verKey) {
        if (verObj.ID > 0 && !verObj.hasOwnProperty('mainRow')){
            if (verObj.Quantity < verObj.OriginalQuantity) {
                var changedQty = angular.copy(verObj);
                changedQty['Quantity'] = verObj.OriginalQuantity - verObj.Quantity;
                $scope.allUnverifiedData.push(changedQty);

            }
        }else if (verObj.ID > 0 && verObj.hasOwnProperty('mainRow')){
            var mainQty = parseFloat(verObj.Quantity)
            if (mainQty < verObj.newQuantity) {
                var changedQty1 = angular.copy(verObj);
                changedQty1['Quantity'] = verObj.newQuantity - mainQty;
                $scope.allUnverifiedData.push(changedQty1);

            }
        }else if (verObj.ID < 0 && !verObj.hasOwnProperty('mainRow')){
            var mainQty1 = parseFloat(verObj.Quantity)
            if (mainQty1 < verObj.newQuantity) {
                var changedQty2 = angular.copy(verObj);
                changedQty2['Quantity'] = verObj.newQuantity - mainQty1;

                $scope.allUnverifiedData.push(changedQty2);

            }
        }

    });

        }
        if ($scope.selectActive < $scope.total) {
            $scope.selectActive++;
        }
        else if ($scope.selectActive == $scope.total) {
            $scope.selectActive = 0;
        }

        $state.go('editInventory.'+ $scope.itemsSteps[$scope.selectActive].Name);
    }
    $scope.goBack = function () {
        if($scope.selectActive > 0){
          // (function(){
            var confirmbox = confirm("you will lose all the edits")
          //  alert("you will lose all the edits");
           if(confirmbox == true) {
                $scope.selectActive--;
                $scope.verifiedData = $scope.originalInventoryData;
                $scope.allUnverifiedData = $scope.originalUnverifiedData;
            }

      // }())
        }
        $state.go('editInventory.'+ $scope.itemsSteps[$scope.selectActive].Name);
        if($scope.selectActive == 0){
            //$state.go('inventoryDetail/'+gy);
        }
    }
    $scope.showDetails = function(tabId){
        console.log('tabId',tabId);
        $mdDialog.show({
            templateUrl:'missingitemmodel.html',
            controller:'missingitemmodelCtrl as misd',
            clickOutsideToClose:true,
            locals: {
                packets: $scope.wholeResp.SafeBox.Packets,
                packetId: tabId,
                shortMode:true
            },
            bindToController : true
        });

    }
});
