require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;
var deviceThis, device;

PlugBaseWithUSB = function(platform, config) {
    this.init(platform, config);
    
    Accessory = platform.Accessory;
    PlatformAccessory = platform.PlatformAccessory;
    Service = platform.Service;
    Characteristic = platform.Characteristic;
    UUIDGen = platform.UUIDGen;
    
    deviceThis = this;
    device = new miio.Device({
        address: deviceThis.config['ip'],
        token: deviceThis.config['token']
    });
    
    this.accessories = {};
    if(!this.config['outletDisable'] && this.config['outletName'] && this.config['outletName'] != "") {
        this.accessories['outletAccessory'] = new PlugBaseWithUSBOutlet();
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new PlugBaseWithUSBTemperature();
    }
    if(!this.config['switchUSBDisable'] && this.config['switchUSBName'] && this.config['switchUSBName'] != "") {
        this.accessories['switchUSBAccessory'] = new PlugBaseWithUSBSwitchUSB();
    }
    
    return this.obj2array(this.accessories);
}
inherits(PlugBaseWithUSB, Base);

PlugBaseWithUSBOutlet = function() {
    this.name = deviceThis.config['outletName'];
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
    services.push(outletService);

    return services;
}

PlugBaseWithUSBOutlet.prototype.getPower = function(callback) {
    device.call("get_prop", ["on"])
        .then(result => {
            callback(null, result[0]);
        });
}

PlugBaseWithUSBOutlet.prototype.setPower = function(value, callback) {
    if(value) {
        device.call("set_on", []);
    } else {
        device.call("set_off", []);
    }
    
    callback(null);    
}

PlugBaseWithUSBTemperature = function() {
    this.name = deviceThis.config['temperatureName'];
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
    device.call("get_prop", ["temperature"])
        .then(result => {
            callback(null, result[0]);
        });
}

PlugBaseWithUSBSwitchUSB = function() {
    this.name = deviceThis.config['switchUSBName'];
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
    device.call("get_prop", ["usb_on"])
        .then(result => {
            callback(null, result[0]);
        });
}

PlugBaseWithUSBSwitchUSB.prototype.setUSBPower = function(value, callback) {
    if(value) {
        device.call("set_usb_on", []);
    } else {
        device.call("set_usb_off", []);
    }
    
    callback(null);    
}