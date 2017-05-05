App.directive('readOnlyInventoryGrid', function () {
    return {
        restrict: 'E',
        scope: {
            packets: "=",
            packetId: "=",
            shortMode : "="
        },
        templateUrl: 'readOnlyInvenGrid.html',
        controllerAs: "roInvGrid",
        controller: function ($rootScope, $scope, $filter, $mdDialog) {
            var _that = this;
            _that.ShowPackets = false;
            _that.selectedInventory = [];
            _that.presentSubcategories = [];
            _that.SubCategories = $rootScope.Metadata.SubCategories;
            _that.packets = filterPackets();

            //Private Functions
            function filterPackets()
            {
                var filteredPackets = [];
                for (i = 0; i < $scope.packets.length; i++) {
                    if ($scope.packets[i].Type.Id != "MSTR") {
                        filteredPackets.push($scope.packets[i]);
                    }
                }
                return filteredPackets;
            }

            function ArrayContains(array, searchString) {
                var index = 0;
                var found = false;

                while (!found && index < array.length) {
                    if (array[index] == searchString)
                    {
                        found = true;
                    }
                    index++;
                }

                return found;
            }

            function AddSubCategoryCodeToInventoryItems()
            {
                var i = 0;
                for (i = 0; i < _that.selectedInventory.length ; i++) {
                    _that.selectedInventory[i].SubCategoryCode = _that.selectedInventory[i].SubCategory.Code;
                    //Add subCategory to existing subcategories array
                    if (!ArrayContains(_that.presentSubcategories, _that.selectedInventory[i].SubCategory.Code))
                        _that.presentSubcategories.push(_that.selectedInventory[i].SubCategory.Code);
                }
            }

            function Init() {
                console.log('INSIDE packetInventoryController');
                console.log("packetId", $scope.packetId);

                if ($scope.packetId != null) {
                    //There is a selected packet id. Find the related inventory
                    _that.ChangePacketSelected($scope.packetId);
                }
                else {
                    //Show all packet names and select Store as default
                    _that.ShowPackets = true;
                    angular.forEach($scope.packets, function (packet) {
                        if (packet.Type.Desc.toUpperCase() == 'LOCATION') {
                            _that.selectedPacketId = packet.Id;
                            _that.selectedInventory = packet.Inventory;
                        }
                    });
                }

                AddSubCategoryCodeToInventoryItems();
            }

            //Scope Functions
            _that.HasItems = function (subCatCode) {
                if (ArrayContains(_that.presentSubcategories, subCatCode))
                    return true;
                else
                    return false;
            }

            _that.ChangePacketSelected = function (packetId) {
                console.log('ChangePacketSelected: ', packetId);

                //Reset data
                _that.selectedInventory = [];
                _that.presentSubcategories = [];

                angular.forEach($scope.packets, function (packet) {
                    if (packet.Id == packetId) {
                        _that.selectedInventory = packet.Inventory;
                    }
                });

                AddSubCategoryCodeToInventoryItems();
                console.log('done');
            }

            _that.ShowCategory = function (subCategoriesInCategory) {
                //If at least one of these has items then we must show the Category
                var noSubCategoryFound = true;
                var i = 0;
                while (noSubCategoryFound && i < subCategoriesInCategory.length)
                {
                    if (ArrayContains(_that.presentSubcategories, subCategoriesInCategory[i].Code))
                    {
                        noSubCategoryFound = false;
                    }
                    i++;
                }

                return !noSubCategoryFound;
            }

            //Initialize;
            Init();
        }
    }
});
