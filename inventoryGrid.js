App.directive('inventoryGrid', function (myfactory) {
    return {
        restrict: 'E',
        scope: {
            subCategoryCode: "=",
            data: "=",
            metaData:"=",
            invData:"=",
            section:"@"
           
        },
        templateUrl: 'inventoryGrid.html',
        controllerAs: "invGrid",
        controller: function ($scope, $filter, $mdDialog,$rootScope, $state) {
            $scope.updateFilter = function(){
                $scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode.Code}},true);
                return $scope.filterdData;
            }
          //  console.log("state", $state)
            /*$scope.$on('updateFilterData', function(e) {
                $scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode.Code}},true);
            });*/
        //$rootScope.id = -99;
        	//$scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode.Code}},true);
           if($state.current.name =='editInventory.Step 1'){
               $scope.checkrepodata = false;
               if($scope.section=='repoData')
                   $scope.checkrepodata = true;
           }

            $scope.metadata=$scope.metaData;
            //$scope.section= $scope.section;
            $scope.chkMisgDat=false;
            if($scope.section=='missingData')
                $scope.chkMisgDat=true;
            var _that = this;
            //find selected sub category
            	//$rootScope.subCat=$scope.subCategories;  
            angular.forEach($scope.metadata.SubCategories, function (subCategory, key) {
                if (subCategory.Code === $scope.subCategoryCode.Code) {
                    _that.selectedSubCategory = subCategory;
                    //console.log("sennndsnks", _that.selectedSubCategory );
                }
            });
            var found = false;
            angular.forEach(_that.selectedSubCategory.ColumnDefinitions,function(colDefVal,colDefKey){
                if(colDefVal.ColumnName){
                    if(colDefVal.ColumnName=='REMOVE_ITEM'){
                        found = true;
                    }
                }
            });
            if(!found){
    			_that.selectedSubCategory.ColumnDefinitions.push(
    			{
    				"ColumnName": "REMOVE_ITEM",
    				"Label": ''
    			});
            }

            /*var currArr;
            $scope.rowVerified=function(item){
                currArr = [];
                angular.forEach($scope.updateFilter(),function(obj){
                    if(obj.IsVerified){
                        currArr.push(obj);
                    }
                });*/
                //myfactory.setVerifiedData(item.SubCategory.Code,currArr);
           //*/ }
            $scope.addRowToTable=function(){
                $scope.newCloned=myfactory.getEmptyRowObject($scope.subCategoryCode.Code);

                //$scope.newCloned=angular.copy($scope.invData[0]);

            	$scope.newCloned.SubCategory.Code=$scope.subCategoryCode.Code;
            	//$scope.newCloned= angular.copy($scope.data[$scope.data.length-1]);
            	for(k in $scope.newCloned){
            		if(!(typeof($scope.newCloned[k])=='object' && $scope.newCloned[k] != null)){
            			$scope.newCloned[k] = '';
            		}
				}
                //myfactory.getIncrement();
                //$scope.$parent.setIncrement();
                $scope.newCloned.ID=myfactory.getIncrement();
            	$scope.newCloned.removeItem=true;                
                $scope.newCloned.IsVerified=false;                               
                $scope.newCloned.IsQuantityChanged=false;                
            	$scope.data.push($scope.newCloned);
            	//$scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode.Code}},true);
            }
            $scope.removeRowFromTable=function(ind,itm){
                angular.forEach($scope.data,function(datVal,datKey){
                    if(datVal.ID==itm.ID)
                        $scope.data.splice(datKey, 1);

                });
               //$scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode.Code}},true);
            }
            $scope.undoRowFromTable=function(ind,itm){
                var deletedItem;
                var boolChk=true;
                angular.forEach($scope.data,function(datVal,datKey){
                    if(datVal.ID==itm.ID) {
                        deletedItem = $scope.data.splice(datKey, 1);
                        deletedItem[0].IsVerified = true;
                    }
                });
                angular.forEach($scope.$parent.verifiedData,function(verVal,verKey){
                    if(verVal.ID==deletedItem[0].ID){
                        deletedItem[0].Quantity=verVal.OriginalQuantity;
                        $scope.$parent.verifiedData[verKey]=deletedItem[0];
                        boolChk=false;
                    }
                });
                if(boolChk){
                    $scope.$parent.verifiedData.push(deletedItem[0]);
                }
                //$scope.$apply();
                //$scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode.Code}},true);
            }

            $scope.reclassificationModel = function (col,itm) {
                $mdDialog.show({
                    templateUrl : 'reclassificationModel.html',
                    controller: 'reclassificationCtrl',
                    clickOutsideToClose:true,
                    resolve:{
                        data:function(){
                            return {rows:itm,catg:$scope.subCategoryCode, allcategories: $scope.metadata.SubCategories,repositoryData:$scope.data};
                        }
                    }
                }).then(function(res) {
                    if(res) {
                        $scope.data = res;
                        $rootScope.$broadcast('updateRepositoryData', res);
                        $rootScope.$broadcast('updatestep2RepositoryData', res);
                        //$scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode.Code}},true);
                    }
                }).finally(function() {
                    console.log('closed dialog');
                });
            }
        }
    }
});
App.controller('reclassificationCtrl',function($scope,data,myfactory,$mdDialog){
    $scope.dupData=angular.copy(data);
    $scope.catg=$scope.dupData.catg;
    $scope.columns=$scope.dupData.catg.ColumnDefinitions;
    $scope.allcategories = $scope.dupData.allcategories;
    $scope.dropDownCategories=angular.copy($scope.allcategories);
    $scope.selRow=$scope.dupData.rows;
    $scope.selRow.newQuantity = angular.copy($scope.dupData.rows.Quantity);
    $scope.selRow['mainRow']=true;
    $scope.dataOnPopup=[];
    var selTable={
        'table':$scope.dupData.catg.Code,
        'data':[angular.copy($scope.selRow)]
    };
    $scope.dataOnPopup.push(selTable);
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.checkqty = function () {
        var qq=0;
        angular.forEach($scope.dataOnPopup, function (rowVal, rowKey) {
            angular.forEach(rowVal.data,function(indRowVal,indRowKey){
                qq+=indRowVal.Quantity;
                console.log("qqqqqqqqqqqqq", qq);
            })
        })
        if(qq>$scope.selRow.Quantity){
            alert("your quantity is more than the original one");
        }else{
            var finalArrToPushinRepos=[];
            angular.forEach($scope.dataOnPopup, function (rowVal, rowKey) {
                angular.forEach(rowVal.data,function(indRowVal,indRowKey){
                    /*if('mainRow' in indRowVal){
                        delete indRowVal.mainRow;
                    }*/
                    if('removeItem' in indRowVal){
                        delete indRowVal.removeItem;
                    }
                    finalArrToPushinRepos.push(indRowVal);
                })
            });
            var dataChangedBool=false;
            console.log('data.repositoryData',data.repositoryData);
            angular.forEach(data.repositoryData,function(repVal,repKey,repos){
                if(finalArrToPushinRepos.length && repVal.ID==finalArrToPushinRepos[0].ID){
                    if(JSON.stringify(repVal)!=JSON.stringify(finalArrToPushinRepos[0])) {
                        repos.splice(repKey, 1, finalArrToPushinRepos[0]);
                        finalArrToPushinRepos.splice(0, 1);
                        dataChangedBool = true;
                    }else if(finalArrToPushinRepos.length==1){
                        repos.splice(repKey, 1);
                        dataChangedBool = true;
                    }
                }
            });
            if(dataChangedBool) {
                data.repositoryData = data.repositoryData.concat(finalArrToPushinRepos);
                console.log("datatrepositort", data.repositoryData);
            }
            $mdDialog.hide(data.repositoryData);
        }
    }

    /*function spliceCatagories(sel){
        angular.forEach($scope.dropDownCategories,function(sldVal,sldKey,data){
            if(sldVal.Code == sel.Code) {
                sldVal['trunctate']=true;
                $scope.catgSelected = sldVal;
            }
        });
    }*/
    /*spliceCatagories($scope.dupData.catg);
    $scope.mappingObj=myfactory.getMappingObject();
    if($scope.dropDownCategories.length>1)
        $scope.dataOnPopup.push({});*/
    //$scope.tags=['table'];
    /*$scope.selectDpCahnge = function(data){
        if($scope.catgSelected){
            $scope.catgSelected['trunctate']=false;
        }
        $scope.catgSelected = data;
        $scope.showDP=!$scope.showDP;
        angular.forEach($scope.dropDownCategories,function(val,key){
            if(val.Name==data.Name) {
                $scope.columns = angular.copy(val.ColumnDefinitions);
                $scope.tabCode = val.Code;
                //$scope.selrow=angular.copy($scope.rows);
                console.log("rowssssssssssssss", duplicateData,$scope.rows);
                console.log("colms", $scope.columns);
                var duplicateData = angular.copy($scope.selRow);
                angular.forEach($scope.columns, function (colVal, colKey) {
                    if ($scope.mappingObj.hasOwnProperty(colVal.ColumnName)) {
                        colVal.popupColumn = true;
                        if (colVal.ColumnName == "DESC_1" && colVal.ControlType == "DROPDOWN") {
                            colVal.IsEditable = true;
                            var colName = $scope.mappingObj[colVal.ColumnName];
                            duplicateData[colName] = '';
                        }
                        $scope.rows = duplicateData;
//                        $scope.rowsOnPopup=duplicateData;
                    }
                });
            }

        });
        $scope.chkMisgDat=false;
        spliceCatagories(data)
    }*/
    /*$scope.showListPopup = function(){
        $scope.showDP=!$scope.showDP;
    }*/

    /*$scope.bingValue=function(a,b){
        return a[b];
    }*/

});


