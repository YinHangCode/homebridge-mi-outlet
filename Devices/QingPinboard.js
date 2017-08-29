require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

QingPinboard = function(platform, config) {
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
        this.accessories['outletAccessory'] = new QingPinboardOutlet(this);
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new QingPinboardTemperature(this);
    }
    
    return this.obj2array(this.accessories);
}
inherits(QingPinboard, Base);

QingPinboardOutlet = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['outletName'];
    this.platform = dThis.platform;
}

QingPinboardOutlet.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Qing Pinboard")
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

QingPinboardOutlet.prototype.getPower = function(callback) {
    this.device.call("get_prop", ["power"]).then(result => {
        this.platform.log.debug("[MiOutletPlatform][DEBUG]QingPinboard - Outlet - getPower: " + result);
        callback(null, result[0] === 'on' ? 1 : 0);
    }).catch(function(err) {
        this.platform.log.error("[MiOutletPlatform][ERROR]QingPinboard - Outlet - getPower Error: " + err);
        callback(true);
    });
}

QingPinboardOutlet.prototype.setPower = function(value, callback) {
    if(value) {
        this.device.call("set_power", ['on']);
    } else {
        this.device.call("set_power", ['off']);
    }
    
    callback(null);    
}

QingPinboardTemperature = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['temperatureName'];
    this.platform = dThis.platform;
}

QingPinboardTemperature.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Qing Pinboard")
        .setCharacteristic(Characteristic.SerialNumber, "Undefined");
    services.push(infoService);
    
    var temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this))
    services.push(temperatureService);

    return services;
}

QingPinboardTemperature.prototype.getTemperature = function(callback) {
    this.device.call("get_prop", ["temperature"]).then(result => {
        this.platform.log.debug("[MiOutletPlatform][DEBUG]QingPinboard - Temperature - getTemperature: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        this.platform.log.error("[MiOutletPlatform][ERROR]QingPinboard - Temperature - getTemperature Error: " + err);
        callback(true);
    });
}
