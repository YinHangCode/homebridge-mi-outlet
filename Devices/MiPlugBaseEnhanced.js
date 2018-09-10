require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

MiPlugBaseEnhanced = function(platform, config) {
    this.init(platform, config);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
    
    this.device = new miio.Device({
        address: this.config['ip'],
        token: this.config['token']
    });
    
    this.accessories = {};
    if(!this.config['outletDisable'] && this.config['outletName'] && this.config['outletName'] != "") {
        this.accessories['outletAccessory'] = new MiPlugBaseEnhancedOutlet(this);
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new MiPlugBaseEnhancedTemperature(this);
    }
    if(!this.config['switchUSBDisable'] && this.config['switchUSBName'] && this.config['switchUSBName'] != "") {
        this.accessories['switchUSBAccessory'] = new MiPlugBaseEnhancedSwitchUSB(this);
    }
    if(!this.config['switchLEDDisable'] && this.config['switchLEDName'] && this.config['switchLEDName'] != "") {
        this.accessories['switchLEDAccessory'] = new MiPlugBaseEnhancedSwitchLED(this);
    }
    var accessoriesArr = this.obj2array(this.accessories);
    
    this.platform.log.debug("[MiOutletPlatform][DEBUG]Initializing " + this.config["type"] + " device: " + this.config["ip"] + ", accessories size: " + accessoriesArr.length);
    
    return accessoriesArr;
}
inherits(MiPlugBaseEnhanced, Base);

MiPlugBaseEnhancedOutlet = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['outletName'];
    this.platform = dThis.platform;
}

MiPlugBaseEnhancedOutlet.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Plug Base Enhanced")
        .setCharacteristic(Characteristic.SerialNumber, "Undefined");
    services.push(infoService);
    
    var outletService = new Service.Outlet(this.name);
    outletService
        .getCharacteristic(Characteristic.On)
        .on('get', this.getPower.bind(this))
        .on('set', this.setPower.bind(this));
    outletService
        .getCharacteristic(Characteristic.OutletInUse)
        .on('get', this.getOutletInUse.bind(this));
    services.push(outletService);

    return services;
}

MiPlugBaseEnhancedOutlet.prototype.getOutletInUse = function(callback) {
    var that = this;
    this.device.call("get_prop", ["power"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiPlugBaseEnhanced - Outlet - getOutletInUse: " + result);
        callback(null, result[0] === '100' ? true : false);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiPlugBaseEnhanced - Outlet - getOutletInUse Error: " + err);
        callback(err);
    });
}

MiPlugBaseEnhancedOutlet.prototype.getPower = function(callback) {
    var that = this;
    this.device.call("get_prop", ["power"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiPlugBaseEnhanced - Outlet - getPower: " + result);
        callback(null, result[0] === '100' ? true : false);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiPlugBaseEnhanced - Outlet - getPower Error: " + err);
        callback(err);
    });
}

MiPlugBaseEnhancedOutlet.prototype.setPower = function(value, callback) {
    var that = this;
    that.device.call("set_power", [value ? "on" : "off"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiPlugBaseEnhanced - Outlet - setPower Result: " + result);
        if(result[0] === "ok") {
            callback(null);
        } else {
            callback(new Error(result[0]));
        }
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiPlugBaseEnhanced - Outlet - setPower Error: " + err);
        callback(err);
    });
}

MiPlugBaseEnhancedTemperature = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['temperatureName'];
    this.platform = dThis.platform;
}

MiPlugBaseEnhancedTemperature.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Plug Base Enhanced")
        .setCharacteristic(Characteristic.SerialNumber, "Undefined");
    services.push(infoService);
    
    var temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this))
    services.push(temperatureService);

    return services;
}

MiPlugBaseEnhancedTemperature.prototype.getTemperature = function(callback) {
    var that = this;
    this.device.call("get_prop", ["temperature"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiPlugBase - MiPlugBaseEnhanced - getTemperature: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiPlugBase - MiPlugBaseEnhanced - getTemperature Error: " + err);
        callback(err);
    });
}

MiPlugBaseEnhancedSwitchLED = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['switchLEDName'];
    this.platform = dThis.platform;
}

MiPlugBaseEnhancedSwitchLED.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Plug Base Enhanced")
        .setCharacteristic(Characteristic.SerialNumber, "Undefined");
    services.push(infoService);
    
    var switchLEDService = new Service.Lightbulb(this.name);
    switchLEDService
        .getCharacteristic(Characteristic.On)
        .on('get', this.getLEDPower.bind(this))
        .on('set', this.setLEDPower.bind(this));
    services.push(switchLEDService);

    return services;
}

MiPlugBaseEnhancedSwitchLED.prototype.getLEDPower = function(callback) {
    var that = this;
    this.device.call("get_prop", ["wifi_led"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiPlugBaseEnhanced - SwitchLED - getLEDPower: " + result);
        callback(null, result[0] === 'on' ? true : false);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiPlugBaseEnhanced - SwitchLED - getLEDPower Error: " + err);
        callback(err);
    });
}

MiPlugBaseEnhancedSwitchLED.prototype.setLEDPower = function(value, callback) {
    var that = this;
    that.device.call("set_wifi_led", [value ? "on" : "off"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiPlugBaseEnhanced - SwitchLED - setLEDPower Result: " + result);
        if(result[0] === "ok") {
            callback(null);
        } else {
            callback(new Error(result[0]));
        }
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiPlugBaseEnhanced - SwitchLED - setLEDPower Error: " + err);
        callback(err);
    });
}

MiPlugBaseEnhancedSwitchUSB = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['switchUSBName'];
    this.platform = dThis.platform;
}

MiPlugBaseEnhancedSwitchUSB.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Plug Base Enhanced")
        .setCharacteristic(Characteristic.SerialNumber, "Undefined");
    services.push(infoService);
    
    var switchService = new Service.Switch(this.name);
    switchService
        .getCharacteristic(Characteristic.On)
        .on('get', this.getUSBPower.bind(this))
        .on('set', this.setUSBPower.bind(this));
    services.push(switchService);

    return services;
}

MiPlugBaseEnhancedSwitchUSB.prototype.getUSBPower = function(callback) {
    var that = this;
    this.device.call("get_prop", ["usb_on"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiPlugBaseEnhanced - SwitchUSB - getUSBPower: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiPlugBaseEnhanced - SwitchUSB - getUSBPower Error: " + err);
        callback(err);
    });
}

MiPlugBaseEnhancedSwitchUSB.prototype.setUSBPower = function(value, callback) {
    var that = this;
    that.device.call(value ? "set_usb_on" : "set_usb_off", []).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiPlugBaseEnhanced - SwitchUSB - setUSBPower Result: " + result);
        callback(null);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiPlugBaseEnhanced - SwitchUSB - setUSBPower Error: " + err);
        callback(err);
    });
}