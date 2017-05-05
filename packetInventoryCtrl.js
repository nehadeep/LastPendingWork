
App.controller('packetInventoryController', packetInventoryController);

function packetInventoryController() {
    var _that = this;
    _that.selectedPacketType = "";

    console.log('Params:');
    console.log("safeboxId", _that.safeboxId);
    console.log("packets", _that.packets);
    console.log("packetId", _that.packetId);

    //Get Selected Packet Type
    if (_that.packetId != null) {
        var i = 0;
        var packetNotFound = true;

        while(packetNotFound && i <_that.packets.length) {
            if (_that.packets[i].Id == _that.packetId) {
                packetNotFound = false;
                _that.selectedPacketType = _that.packets[i].Type.Desc;
            }
            i++;
        };
    }
};

/*for referece*/

/*
_that.ShowPacketInventory = function () {

    $mdDialog.show({
        templateUrl: BASE_URL + 'Scripts/App/Session/templates/modals/PacketInventory.html',
        controller: 'packetInventoryController as pic',
        locals: {
            safeboxId: _that.boxKey,
            packets: [_that.packet],
            packetId: _that.packet.Id
        },
        bindToController: true,
        clickOutsideToClose: true
    });
}*/
