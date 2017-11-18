require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;

MiQingPinboard = function(platform, config) {
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
        this.accessories['outletAccessory'] = new MiQingPinboardOutlet(this);
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new MiQingPinboardTemperature(this);
    }
    var accessoriesArr = this.obj2array(this.accessories);
    
    this.platform.log.debug("[MiOutletPlatform][DEBUG]Initializing " + this.config["type"] + " device: " + this.config["ip"] + ", accessories size: " + accessoriesArr.length);
    
    return accessoriesArr;
}
inherits(MiQingPinboard, Base);

MiQingPinboardOutlet = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['outletName'];
    this.platform = dThis.platform;
}

MiQingPinboardOutlet.prototype.getServices = function() {
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
    outletService
        .getCharacteristic(Characteristic.OutletInUse)
        .on('get', this.getOutletInUse.bind(this));
    services.push(outletService);

    return services;
}

MiQingPinboardOutlet.prototype.getOutletInUse = function(callback) {
    var that = this;
    this.device.call("get_prop", ["power_consume_rate"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiQingPinboard - Outlet - getOutletInUse: " + result);
        callback(null, result[0] && result[0] > 0 ? true : false);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiQingPinboard - Outlet - getOutletInUse Error: " + err);
        callback(err);
    });
}

MiQingPinboardOutlet.prototype.getPower = function(callback) {
    var that = this;
    this.device.call("get_prop", ["power"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiQingPinboard - Outlet - getPower: " + result);
        callback(null, result[0] === 'on' ? 1 : 0);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiQingPinboard - Outlet - getPower Error: " + err);
        callback(err);
    });
}

MiQingPinboardOutlet.prototype.setPower = function(value, callback) {
    var that = this;
    that.device.call("set_power", [value ? "on" : "off"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiQingPinboard - Outlet - setPower Result: " + result);
        if(result[0] === "ok") {
            callback(null);
        } else {
            callback(new Error(result[0]));
        }
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiQingPinboard - Outlet - setPower Error: " + err);
        callback(err);
    });
}

MiQingPinboardTemperature = function(dThis) {
    this.device = dThis.device;
    this.name = dThis.config['temperatureName'];
    this.platform = dThis.platform;
}

MiQingPinboardTemperature.prototype.getServices = function() {
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

MiQingPinboardTemperature.prototype.getTemperature = function(callback) {
    var that = this;
    this.device.call("get_prop", ["temperature"]).then(result => {
        that.platform.log.debug("[MiOutletPlatform][DEBUG]MiQingPinboard - Temperature - getTemperature: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        that.platform.log.error("[MiOutletPlatform][ERROR]MiQingPinboard - Temperature - getTemperature Error: " + err);
        callback(err);
    });
}
