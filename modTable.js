App.directive('modTable', function (myfactory,$rootScope) {
    return {
        restrict: 'E',
        scope: {
            allcategoriesdata : "=",
            rows:"=",
            indLast:"=",
            currentInd: "=",
            indFirst:"=",
            items:"=",
            catg:"=",
            selRow:"="
        },
        templateUrl: 'dynTable.html',
        controller : function ($scope) {
            //console.log($scope.data,$scope.items);
            $scope.mainSelRow=angular.copy($scope.selRow);
            delete $scope.mainSelRow['mainRow'];
            $scope.data=$scope.items[$scope.currentInd];
            var chkboolForFirTimSel=true;
            $scope.mappingObj=myfactory.getMappingObject();

            $scope.showListPopup = function(){
                if(chkboolForFirTimSel)
                    $scope.showDP=!$scope.showDP;
            }
            $scope.bindSeletedtext = $scope.items[$scope.currentInd].table? $scope.catg.Name : 'Select a Sub Catageory !';
            if($scope.indFirst){
                angular.forEach($scope.allcategoriesdata,function(val,key) {
                    if ($scope.items[$scope.currentInd].table == val.Code) {
                        $scope.columns = angular.copy(val.ColumnDefinitions);
                    }
                });
                spliceCatagories($scope.catg);
                if($scope.allcategoriesdata.length>1)
                    $scope.items.push({
                        'table':'',
                        'data':[]
                    });
                $scope.chkMisgDat = true;
            }
            $scope.TotalAmt = function(tot,fir,sec){
                tot=parseFloat(fir)*parseFloat(sec);
                tot= tot ? tot : 0;
                return tot;
            }
            function spliceCatagories(sel){
                angular.forEach($scope.allcategoriesdata,function(sldVal,sldKey,data){
                    if(sldVal.Code == sel.Code) {
                        sldVal['trunctate']=true;
                        if($scope.indFirst)
                            $scope.catgSelected = sldVal;
                    }
                });
            }
            function chkQnty() {
                var chkbool;
                if($scope.items[0].data[0].Quantity>0){
                    $scope.items[0].data[0].Quantity--;
                    $scope.items[0].data[0].newQuantity--;
                    chkbool=true;
                }
                return chkbool;
            }
            $scope.selectDpCahnge = function(data){
                if($scope.catgSelected){
                    $scope.catgSelected['trunctate']=false;
                }
                $scope.catgSelected = data;
                $scope.bindSeletedtext = data.Name;
                $scope.showDP=!$scope.showDP;
                angular.forEach($scope.allcategoriesdata,function(val,key){
                    if(val.Code==data.Code) {
                        $scope.columns = angular.copy(val.ColumnDefinitions);
                        $scope.tabCode = val.Code;
                        $scope.duplicateData = angular.copy($scope.mainSelRow);
                        $scope.duplicateData.SubCategory.Code=$scope.tabCode;
                        angular.forEach($scope.columns, function (colVal, colKey) {
                            if ($scope.mappingObj.hasOwnProperty(colVal.ColumnName)) {
                                colVal.popupColumn = true;
                                if (colVal.ColumnName == "DESC_1" && colVal.ControlType == "DROPDOWN") {
                                    colVal.IsEditable = true;
                                    var colName = $scope.mappingObj[colVal.ColumnName];
                                    $scope.duplicateData[colName] = '';
                                    if($scope.indFirst)
                                        $scope.items[0].data[0][colName]='';
                                }
                            }
                        });
                        $scope.duplicateData.ID=myfactory.getIncrement();
                        $scope.duplicateData['IsVerified']=true;
                        if(!$scope.indFirst) {
                            var elig = chkQnty();
                            if (elig) {
                                $scope.duplicateData.Quantity = parseFloat(1);
                                $scope.duplicateData.newQuantity = parseFloat(1);
                            } else {
                                $scope.duplicateData.Quantity = parseFloat(0);
                                $scope.duplicateData.newQuantity = parseFloat(0);
                            }

                        }
                    }
                });
                if($scope.indLast) {
                    $scope.items[$scope.items.length-1].table=$scope.tabCode;
                    $scope.items[$scope.items.length-1].data=[angular.copy($scope.duplicateData)];
                    $scope.items.push({
                        'table':'',
                        'data':[]
                    });
                    spliceCatagories(data);
                }
                $scope.chkMisgDat = false;
                if($scope.indFirst) {
                    $scope.items[0].table=$scope.tabCode;
                    $scope.items[0].data[0].SubCategory.Code=$scope.tabCode;
                    spliceCatagories(data);
                }else{
                    chkboolForFirTimSel = false;
                }
            }
            $scope.addRowToTable = function(cc){
                var newCloned=angular.copy(myfactory.getEmptyRowObject($scope.tabCode));
                console.log("tabcode",$scope.tabCode);
                for(k in newCloned){
                    if(!(typeof(newCloned[k])=='object' && newCloned[k] != null)){
                        if(typeof(newCloned[k])!='number')
                            newCloned[k] = '';
                    }
                }
                if(chkQnty()){
                    newCloned['Quantity'] = 1;
                    newCloned['newQuantity'] = 1;
                }else{
                    newCloned['Quantity'] = 0;
                    newCloned['newQuantity'] = 0;
                }
                newCloned.ID=myfactory.getIncrement();
                newCloned['removeItem']=true;
                newCloned['IsVerified']=true;
                $scope.items[$scope.currentInd].data.push(newCloned);
            }
            $scope.removeRowFromTable = function(itm){
                angular.forEach($scope.items,function(datVal,datKey,itemsData){
                    if($scope.tabCode==datVal.table) {
                        angular.forEach(datVal.data,function(val,key,data) {
                            if (val.ID == itm.ID) {
                                data.splice(key, 1);

                                if (data.length == 0) {
                                    angular.forEach($scope.allcategoriesdata, function (alcatVal, alcatKey) {
                                        if ($scope.tabCode == alcatVal.Code) {
                                            alcatVal.trunctate = false;
                                        }
                                    });
                                    if($scope.indLast){
                                        chkboolForFirTimSel = true;
                                        datVal.table = '';
                                        datVal.data = [];
                                    }else{
                                        itemsData.splice(datKey,1);
                                    }
                                }

                                if(val.Quantity && val.Quantity>0){
                                    $scope.items[0].data[0].Quantity=parseFloat($scope.items[0].data[0].Quantity)+parseFloat(val.Quantity);
                                    $scope.items[0].data[0].newQuantity = parseFloat($scope.items[0].data[0].Quantity)+parseFloat(val.Quantity);
                                }
                            }
                        });
                    }
                });
            }

            /*$scope.checkqty = function () {
                var qq;
                angular.forEach($scope.rowsOnPopup, function (rowVal, rowKey) {
                    qq+=rowVal.quantity;
                })
                if(qq>$scope.originalQty){
                    alert("your quantity is more than the original one");
                }
            }*/

        }
    }
});


/*
App.filter('customFilter', function(filterFilter) {
    return function(input, filterEach, exclude) {
        filterEach.forEach(function(item) {
            if (angular.equals(item, exclude)) { return; }
            input = filterFilter(input, '!'+item);
        });
        return input;
    };
});*/
