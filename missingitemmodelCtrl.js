App.controller('missingitemmodelCtrl',function($scope, $mdDialog, locals){
    this.packets = locals.packets;
    this.packetId = locals.packetId;
    this.shortMode = locals.shortMode;
    this.selectedPacketType;
    if (this.packetId != null) {
        var i = 0;
        var packetNotFound = true;
        while(packetNotFound && i <this.packets.length) {
            if (this.packets[i].Id == this.packetId) {
                packetNotFound = false;
                this.selectedPacketType = this.packets[i].Type.Desc;
            }
            i++;
        };
    }
});
