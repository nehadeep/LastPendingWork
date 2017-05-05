App.directive('inventoryField', inventoryField);
 
function inventoryField() {
    return {       
        restrict: "E",
        scope: {
            type:"=",
            value: "=",
            //metaData: "=",
            required: "=?",
            regularExpression: "=?",
            lookupKey: "=",
            itemData:"="

        },
        templateUrl: 'inventoryfield.html',
        controller: function ($scope,myfactory,$rootScope) {
            var _that = this;
            _that.readOnly = true;
            $scope.Metadata = $rootScope.Metadata;
            $scope.selItem=$scope.itemData.row;
            //$scope.value=$scope.itemData.row[$scope.itemData.desc];

            if(!$scope.itemData.column.IsEditable && $scope.itemData.column.DefaultValue && $scope.itemData.row.ID<0){
                if($scope.itemData.column.ColumnName=='QUANTY')
                    $scope.value=parseFloat($scope.itemData.column.DefaultValue);
                else
                    $scope.value=$scope.itemData.column.DefaultValue;
            }
            if($scope.itemData.column.popupColumn){
                if(!$scope.itemData.column.IsEditable && $scope.itemData.column.DefaultValue){
                    if($scope.itemData.column.ColumnName=='QUANTY')
                        $scope.value=parseFloat($scope.itemData.column.DefaultValue);
                    else
                        $scope.value=$scope.itemData.column.DefaultValue;
                }else{
                    if(!$scope.itemData.column.ColumnName=="UNIT_AMT")
                        $scope.itemData.column.IsEditable=true;
                }
            }

            var currArr;
            $scope.rowEditEvent=function(itm,value) {
                console.log("all teh values", itm, value);

                if ($scope.itemData.column.ColumnName === 'DESC_1') {
                    var chkBoolForUnitAmt;
                    angular.forEach($scope.itemData.colDefs, function (colObj, colKey) {
                        if (colObj.Label == 'UNIT AMOUNT' && colObj.SourceColumnName == 'LOOKUP_VAL' || colObj.Label == 'FACE VALUE' && colObj.SourceColumnName == 'LOOKUP_VAL') {
                            chkBoolForUnitAmt = true;
                        }
                    });
                    if (chkBoolForUnitAmt)
                        itm.Unit = value;
                }
                // itm.Unit=value.replace(/[^0-9\.]+/g,"");

                if ($scope.itemData.column.ColumnName == 'QUANTY') {
                    itm.IsQuantityChanged = true;
                    itm.Quantity=parseFloat(value);

                }
                if (!itm.IsVerified)
                    itm.IsVerified = true;

                /*currArr = [];
                angular.forEach($scope.$parent.filterdData, function (obj) {
                    if (obj.IsVerified) {
                        currArr.push(obj);
                    }
                });
                myfactory.setVerifiedData(itm.SubCategory.Code, currArr);*/

                /*if (itm.ID < 0){
                    var mappingObj = myfactory.getMappingObject();
                    angular.forEach($scope.itemData.colDefs, function (defVal, defKey) {
                        if(mappingObj.hasOwnProperty(defVal.ColumnName)) {
                            var colName=mappingObj[defVal.ColumnName];
                            if (!$scope.selItem[colName] && defVal.IsRequired) {
                                defVal.valid = false;
                            } else {
                                defVal.valid = true;
                            }
                        }
                    });
                }
                if (value == "" && $scope.itemData.column.IsRequired) {
                    $scope.itemData.column.valid = false;
                } else {
                    $scope.itemData.column.valid = true;
                }*/

                //myfactory.setEmptyFieldValidation($scope.Metadata.SubCategories);
           }
           $scope.toGetQty = function(qty,itmData){
               if (itmData.column.popupColumn && itmData.column.ColumnName == 'QUANTY') {
                   $scope.oldQty = parseFloat(qty);
               }
           }
           $scope.chkEmpty=function(val,itmData){
               console.log($scope.itemData)
               if (itmData.column.ColumnName == 'QUANTY') {
                   if (!val || val == 0) {
                       //alert('fdsfdsfds');
                   }else{
                       val=parseFloat(val);
                   }
                   if(itmData.column.popupColumn){
                       if(!$scope.itemData.whichTable.first){
                           var subs = parseFloat($scope.itemData.wholeDataForQty[0].data[0].Quantity) - (parseFloat(val) - parseFloat($scope.oldQty));
                           $scope.itemData.wholeDataForQty[0].data[0].Quantity = subs >= 0 ? subs : 0;
                           $scope.itemData.wholeDataForQty[0].data[0].newQuantity = subs >= 0 ? subs : 0;
                           itmData.row.newQuantity=val;
                       }
                   }
               }
           }
           $scope.toEdit=function(){
            if($scope.itemData.column.IsEditable && !$scope.$parent.chkMisgDat){
                if($scope.type=='DROPDOWN'){
                    if($scope.selItem.ID<0 || $scope.itemData.column.popupColumn){
                       $scope.ifc.readOnly = !$scope.ifc.readOnly;
                    }
                }else{
                    $scope.ifc.readOnly = !$scope.ifc.readOnly;
                }
            }
           }

        },
        controllerAs: 'ifc'
    };
}

 