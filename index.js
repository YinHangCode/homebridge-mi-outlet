require('./Devices/PlugBase');
require('./Devices/PlugBaseWithUSB');
require('./Devices/IntelligencePinboard');
require('./Devices/QingPinboard');

var fs = require('fs');
var packageFile = require("./package.json");
var PlatformAccessory, Accessory, Service, Characteristic, UUIDGen;

module.exports = function(homebridge) {
    if(!isConfig(homebridge.user.configPath(), "platforms", "MiOutletPlatform")) {
        return;
    }
    
    PlatformAccessory = homebridge.platformAccessory;
    Accessory = homebridge.hap.Accessory;
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    UUIDGen = homebridge.hap.uuid;

    homebridge.registerPlatform('homebridge-mi-outlet', 'MiOutletPlatform', MiOutletPlatform);
}

function isConfig(configFile, type, name) {
    var config = JSON.parse(fs.readFileSync(configFile));
    if("accessories" === type) {
        var accessories = config.accessories;
        for(var i in accessories) {
            if(accessories[i]['accessory'] === name) {
                return true;
            }
        }
    } else if("platforms" === type) {
        var platforms = config.platforms;
        for(var i in platforms) {
            if(platforms[i]['platform'] === name) {
                return true;
            }
        }
    } else {
    }
    
    return false;
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
                new IntelligencePinboard(this, cfgAccessory).forEach(function(accessory, index, arr){
                    myAccessories.push(accessory);
                });
            } else if (cfgAccessory['type'] == "QingPinboard") {
                new QingPinboard(this, cfgAccessory).forEach(function(accessory, index, arr){
                    myAccessories.push(accessory);
                });
            } else if (cfgAccessory['type'] == "QingPinboardWithUSB") {
                new QingPinboard(this, cfgAccessory).forEach(function(accessory, index, arr){
                    myAccessories.push(accessory);
                });
            } else {
            }
        }

        callback(myAccessories);
    }
}