require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

QingPinboardWithUSB = function(platform, config) {
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
        this.accessories['outletAccessory'] = new QingPinboardWithUSBOutlet(this);
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new QingPinboardWithUSBTemperature(this);
    }
    var accessoriesArr = this.obj2array(this.accessories);
    
    this.platform.log.debug("[MiOutletPlatform][DEBUG]Initializing " + this.config["type"] + " device: " + this.config["ip"] + ", accessories size: " + accessoriesArr.length);
    
    return accessoriesArr;
}
inherits(QingPinboardWithUSB, Base);

QingPinboardWithUSBOutlet = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['outletName'];
    this.platform = dThis.platform;
}

QingPinboardWithUSBOutlet.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Qing Pinboard With USB")
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

QingPinboardWithUSBOutlet.prototype.getPower = function(callback) {
    var that = this;
    this.device.call("get_prop", ["power"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]QingPinboardWithUSB - Outlet - getPower: " + result);
        callback(null, result[0] === 'on' ? 1 : 0);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]QingPinboardWithUSB - Outlet - getPower Error: " + err);
        callback(true);
    });
}

QingPinboardWithUSBOutlet.prototype.setPower = function(value, callback) {
    if(value) {
        this.device.call("set_power", ['on']);
    } else {
        this.device.call("set_power", ['off']);
    }
    
    callback(null);    
}

QingPinboardWithUSBTemperature = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['temperatureName'];
    this.platform = dThis.platform;
}

QingPinboardWithUSBTemperature.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Qing Pinboard With USB")
        .setCharacteristic(Characteristic.SerialNumber, "Undefined");
    services.push(infoService);
    
    var temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this))
    services.push(temperatureService);

    return services;
}

QingPinboardWithUSBTemperature.prototype.getTemperature = function(callback) {
    var that = this;
    this.device.call("get_prop", ["temperature"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]QingPinboardWithUSB - Temperature - getTemperature: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]QingPinboardWithUSB - Temperature - getTemperature Error: " + err);
        callback(true);
    });
}
