require('./Devices/MiPlugBase');
require('./Devices/MiPlugBaseWithUSB');
require('./Devices/MiIntelligencePinboard');
require('./Devices/MiQingPinboard');
require('./Devices/MiQingPinboardWithUSB');
require('./Devices/MiPlugBaseEnhanced');

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

    homebridge.registerPlatform('homebridge-mi-outlet', 'MiOutletPlatform', MiOutletPlatform, true);
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

        var deviceCfgs = this.config['deviceCfgs'];
        if(deviceCfgs instanceof Array) {
            for (var i = 0; i < deviceCfgs.length; i++) {
                var deviceCfg = deviceCfgs[i];
                if(null == deviceCfg['type'] || "" == deviceCfg['type'] || null == deviceCfg['token'] || "" == deviceCfg['token'] || null == deviceCfg['ip'] || "" == deviceCfg['ip']) {
                    continue;
                }
                
                if (deviceCfg['type'] == "MiPlugBase") {
                    new MiPlugBase(this, deviceCfg).forEach(function(accessory, index, arr){
                        myAccessories.push(accessory);
                    });
                } else if (deviceCfg['type'] == "MiPlugBaseWithUSB") {
                    new MiPlugBaseWithUSB(this, deviceCfg).forEach(function(accessory, index, arr){
                        myAccessories.push(accessory);
                    });
                } else if (deviceCfg['type'] == "MiIntelligencePinboard") {
                    new MiIntelligencePinboard(this, deviceCfg).forEach(function(accessory, index, arr){
                        myAccessories.push(accessory);
                    });
                } else if (deviceCfg['type'] == "MiQingPinboard") {
                    new MiQingPinboard(this, deviceCfg).forEach(function(accessory, index, arr){
                        myAccessories.push(accessory);
                    });
                } else if (deviceCfg['type'] == "MiQingPinboardWithUSB") {
                    new MiQingPinboardWithUSB(this, deviceCfg).forEach(function(accessory, index, arr){
                        myAccessories.push(accessory);
                    });
                } else if (deviceCfg['type'] == "MiPlugBaseEnhanced") {
                    new MiPlugBaseEnhanced(this, deviceCfg).forEach(function(accessory, index, arr){
                        myAccessories.push(accessory);
                    });
                } else {
                }
            }
            this.log.info("[MiOutletPlatform][INFO]device size: " + deviceCfgs.length + ", accessories size: " + myAccessories.length);
        }
        
        callback(myAccessories);
    }
}