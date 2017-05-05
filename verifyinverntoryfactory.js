App.factory('myfactory', function($http, $q){
	var verifiedInventory = {};
	var repositoryData;
	var newRepositoryData;
	var negId=-1;	   
//	var chkForEmptyValid;

    var quantity;
	function request(url){
		this.method = 'POST';
		this.url = url;
		this.data = '';
		this.header = {

		}
	};
	

	return {
		getIncrement:function(){
	        return negId--;
	    },
		getverifyinventory : function(safeboxId){
			var req = new request('sessiomn.json');

			var data = {
				safeboxId : safeboxId
			};
			req.data = JSON.stringify(data);

			return $http(req).then(function(res){
				return res.data
			},
			function(err){
				return err;
			
			});
		},

		getEditInventoryVM : function (id) {
            var req = new request('editinventory.json');

            var data = {
                'safeboxId' : id
            };
            req.data = JSON.stringify(data);

            return $http(req).then(function(res){
                    return res.data
                },
                function(err){
                    return err;

                });
        },
		setVerifiedData : function(data){
            verifiedInventory = data;
		},
		getVerifiedData : function(){
			var allUnverifiedData = [];
			for(var label in verifiedInventory){
				angular.forEach(verifiedInventory[label],function(obj){
                    allUnverifiedData.push(obj);
                });
			}			
			return allUnverifiedData;
		},
		setRepositoryData : function(data){
			repositoryData = data;
		},
		getRepositoryData : function(){			
			return repositoryData;
		},
		setnewRepositoryData : function(newdata)
		{
            newRepositoryData = newdata;

		},
		getnewRepositoryData : function(){
			return newRepositoryData;
		},


		/*setEmptyFieldValidation :function(data){
			chkForEmptyValid=data;
		},
		getEmptyFieldValidation:function(){
			return chkForEmptyValid;
		},*/
		getMappingObject:function() {
			return {
                'DESC_1':'Description1',
                'DESC_2':'Description2',
                'DESC_3':'Description3',
                'COLR':'Color',
                'BRKN':'IsBroken',
                'UNIT_AMT':'Unit',
                'QUANTY':'Quantity',
                'CURNCY':'Currency',
            }
        },
		getEmptyRowObject:function(tab){
			return{
                "IsVerified":false,
                "IsQuantityChanged":false,
                "IsReclassified":false,
                "RelatedID":0,
                "ID":0,
                "TransactionId":0,
                "SubCategory":{
                    "Code":tab,
                    "Name":null,
                    "HasTotalAmount":false,
                    "HasGrandTotalAmount":false,
                    "Sequence":0,
                    "Template":null,
                    "Category":{
                        "Code":null,
                        "Name":null,
                        "Sequence":0,
                        "Status":null,
                        "Id":null,
                        "Desc":null,
                        "CreatedOn":null,
                        "CreatedBy":null,
                        "LastUpdatedOn":null,
                        "LastUpdatedBy":null
                    },
                    "ColumnDefinitions":[],
                    "Id":null,
                    "Desc":null,
                    "CreatedOn":null,
                    "CreatedBy":null,
                    "LastUpdatedOn":null,
                    "LastUpdatedBy":null
                },
                "Description1":" ",
                "Description2":null,
                "Description3":null,
                "Color":null,
                "IsBroken":null,
                "Currency":null,
                "Unit":1,
                "Quantity":1,
                "OriginalQuantity":1,
                "Value":1
			}
        }
	}
})
