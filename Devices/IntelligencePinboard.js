require('./Base');

const inherits = require('util').inherits;
const miio = require('miio');

var Accessory, PlatformAccessory, Service, Characteristic, UUIDGen;
var deviceThis, device;

IntelligencePinboard = function(platform, config) {
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
        this.accessories['outletAccessory'] = new IntelligencePinboardOutlet();
    }
    if(!this.config['temperatureDisable'] && this.config['temperatureName'] && this.config['temperatureName'] != "") {
        this.accessories['temperatureAccessory'] = new IntelligencePinboardTemperature();
    }
    if(!this.config['switchLEDDisable'] && this.config['switchLEDName'] && this.config['switchLEDName'] != "") {
        this.accessories['switchLEDAccessory'] = new IntelligencePinboardSwitchLED();
    }
    
    return this.obj2array(this.accessories);
}
inherits(IntelligencePinboard, Base);

IntelligencePinboardOutlet = function() {
    this.name = deviceThis.config['outletName'];
}

IntelligencePinboardOutlet.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Intelligence Pinboard")
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

IntelligencePinboardOutlet.prototype.getPower = function(callback) {
    device.call("get_prop", ["power"]).then(result => {
        deviceThis.platform.log.debug("[MiOutletPlatform][DEBUG]IntelligencePinboard - Outlet - getPower: " + result);
        callback(null, result[0] === 'on' ? 1 : 0);
    }).catch(function(err) {
        deviceThis.platform.log.error("[MiOutletPlatform][ERROR]IntelligencePinboard - Outlet - getPower Error: " + err);
        callback(true);
    });
}

IntelligencePinboardOutlet.prototype.setPower = function(value, callback) {
    if(value) {
        device.call("set_power", ['on']);
    } else {
        device.call("set_power", ['off']);
    }
    
    callback(null);    
}

IntelligencePinboardTemperature = function() {
    this.name = deviceThis.config['temperatureName'];
}

IntelligencePinboardTemperature.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Intelligence Pinboard")
        .setCharacteristic(Characteristic.SerialNumber, "Undefined");
    services.push(infoService);
    
    var temperatureService = new Service.TemperatureSensor(this.name);
    temperatureService
        .getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getTemperature.bind(this))
    services.push(temperatureService);

    return services;
}

IntelligencePinboardTemperature.prototype.getTemperature = function(callback) {
    device.call("get_prop", ["temperature"]).then(result => {
        deviceThis.platform.log.debug("[MiOutletPlatform][DEBUG]IntelligencePinboard - Temperature - getTemperature: " + result);
        callback(null, result[0]);
    }).catch(function(err) {
        deviceThis.platform.log.error("[MiOutletPlatform][ERROR]IntelligencePinboard - Temperature - getTemperature Error: " + err);
        callback(true);
    });
}

IntelligencePinboardSwitchLED = function() {
    this.name = deviceThis.config['switchLEDName'];
}

IntelligencePinboardSwitchLED.prototype.getServices = function() {
    var services = [];

    var infoService = new Service.AccessoryInformation();
    infoService
        .setCharacteristic(Characteristic.Manufacturer, "XiaoMi")
        .setCharacteristic(Characteristic.Model, "Intelligence Pinboard")
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

IntelligencePinboardSwitchLED.prototype.getLEDPower = function(callback) {
    device.call("get_prop", ["wifi_led"]).then(result => {
        deviceThis.platform.log.debug("[MiOutletPlatform][DEBUG]IntelligencePinboard - SwitchLED - getLEDPower: " + result);
        callback(null, result[0] === 'on' ? 1 : 0);
    }).catch(function(err) {
        deviceThis.platform.log.error("[MiOutletPlatform][ERROR]IntelligencePinboard - SwitchLED - getLEDPower Error: " + err);
        callback(true);
    });
}

IntelligencePinboardSwitchLED.prototype.setLEDPower = function(value, callback) {
    if(value) {
        device.call("set_wifi_led", ['on']);
    } else {
        device.call("set_wifi_led", ['off']);
    }
    
    callback(null);    
}