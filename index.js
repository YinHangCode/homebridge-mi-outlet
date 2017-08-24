require('./Devices/PlugBase');
require('./Devices/PlugBaseWithUSB');
//require('./Devices/IntelligencePinboard');
//require('./Devices/QingPinboard');
//require('./Devices/QingPinboardWithUSB');

var packageFile = require("./package.json");
var Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    Accessory = homebridge.platformAccessory;
    PlatformAccessory = homebridge.platformAccessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    homebridge.registerPlatform('homebridge-mi-outlet', 'MiOutletPlatform', MiOutletPlatform);
}

function MiOutletPlatform(log, config, api) {
    if(null == config) {
        return;
    }
    
    this.Accessory = Accessory;
    this.PlatformAccessory = PlatformAccessory;
    this.Service = Service;
    this.Characteristic = Characteristic;
    this.UUIDGen = UUIDGen;
    
    this.log = log;
    this.config = config;

    if (api) {
        this.api = api;
    }
	
	this.log.info("[MiOutletPlatform][INFO]**************************************************************");
    this.log.info("[MiOutletPlatform][INFO]          MiOutletPlatform v%s By YinHang", packageFile.version);
    this.log.info("[MiOutletPlatform][INFO]  GitHub: https://github.com/YinHangCode/homebridge-mi-outlet ");
    this.log.info("[MiOutletPlatform][INFO]                                         QQ Group: 107927710  ");
    this.log.info("[MiOutletPlatform][INFO]**************************************************************");
    this.log.info("[MiOutletPlatform][INFO]start success...");
}

MiOutletPlatform.prototype = {
    accessories: function(callback) {
        var myAccessories = [];

        var cfgAccessories = this.config['accessories'];
        if(null == cfgAccessories) {
            return;
        }
        
        for (var i = 0; i < cfgAccessories.length; i++) {
            var cfgAccessory = cfgAccessories[i];
            if (cfgAccessory['type'] == "PlugBase") {
                new PlugBase(this, cfgAccessory).forEach(function(accessory, index, arr){
                    myAccessories.push(accessory);
                });
            } else if (cfgAccessory['type'] == "PlugBaseWithUSB") {
                new PlugBaseWithUSB(this, cfgAccessory).forEach(function(accessory, index, arr){
                    myAccessories.push(accessory);
                });
            } else if (cfgAccessory['type'] == "IntelligencePinboard") {

            } else if (cfgAccessory['type'] == "Intelligence6Pinboard") {

            } else if (cfgAccessory['type'] == "QingPinboard") {

            } else {
            }
        }

        callback(myAccessories);
    }
}