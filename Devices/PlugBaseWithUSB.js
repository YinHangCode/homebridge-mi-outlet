require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

PlugBaseWithUSB = function(platform, config) {
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
        this.accessories['outletAccessory'] = new PlugBaseWithUSBOutlet(this);
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new PlugBaseWithUSBTemperature(this);
    }
    if(!this.config['switchUSBDisable'] && this.config['switchUSBName'] && this.config['switchUSBName'] != "") {
        this.accessories['switchUSBAccessory'] = new PlugBaseWithUSBSwitchUSB(this);
    }
    var accessoriesArr = this.obj2array(this.accessories);
    
    this.platform.log.debug("[MiOutletPlatform][DEBUG]Initializing " + this.config["type"] + " device: " + this.config["ip"] + ", accessories size: " + accessoriesArr.length);
    
    return accessoriesArr;
}
inherits(PlugBaseWithUSB, Base);

PlugBaseWithUSBOutlet = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['outletName'];
    this.platform = dThis.platform;
}

PlugBaseWithUSBOutlet.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Plug Base With USB")
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

PlugBaseWithUSBOutlet.prototype.getOutletInUse = function(callback) {
    var that = this;
    this.device.call("get_prop", ["on"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]PlugBaseWithUSB - Outlet - getOutletInUse: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]PlugBaseWithUSB - Outlet - getOutletInUse Error: " + err);
        callback(err);
    });
}

PlugBaseWithUSBOutlet.prototype.getPower = function(callback) {
    var that = this;
    this.device.call("get_prop", ["on"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]PlugBaseWithUSB - Outlet - getPower: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]PlugBaseWithUSB - Outlet - getPower Error: " + err);
        callback(err);
    });
}

PlugBaseWithUSBOutlet.prototype.setPower = function(value, callback) {
    var that = this;
    that.device.call(value ? "set_on" : "set_off", []).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]PlugBaseWithUSB - Outlet - setPower Result: " + result);
        callback(null);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]PlugBaseWithUSB - Outlet - setPower Error: " + err);
        callback(err);
    });
}

PlugBaseWithUSBTemperature = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['temperatureName'];
    this.platform = dThis.platform;
}

PlugBaseWithUSBTemperature.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Plug Base With USB")
        .setCharacteristic(Characteristic.SerialNumber, "Undefined");
    services.push(infoService);
    
    var temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this))
    services.push(temperatureService);

    return services;
}

PlugBaseWithUSBTemperature.prototype.getTemperature = function(callback) {
    var that = this;
    this.device.call("get_prop", ["temperature"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]PlugBaseWithUSB - Temperature - getTemperature: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]PlugBaseWithUSB - Temperature - getTemperature Error: " + err);
        callback(err);
    });
}

PlugBaseWithUSBSwitchUSB = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['switchUSBName'];
    this.platform = dThis.platform;
}

PlugBaseWithUSBSwitchUSB.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Plug Base With USB")
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

PlugBaseWithUSBSwitchUSB.prototype.getUSBPower = function(callback) {
    var that = this;
    this.device.call("get_prop", ["usb_on"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]PlugBaseWithUSB - SwitchUSB - getUSBPower: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]PlugBaseWithUSB - SwitchUSB - getUSBPower Error: " + err);
        callback(err);
    });
}

PlugBaseWithUSBSwitchUSB.prototype.setUSBPower = function(value, callback) {
    var that = this;
    that.device.call(value ? "set_usb_on" : "set_usb_off", []).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]PlugBaseWithUSB - SwitchUSB - setUSBPower Result: " + result);
        callback(null);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]PlugBaseWithUSB - SwitchUSB - setUSBPower Error: " + err);
        callback(err);
    });
}