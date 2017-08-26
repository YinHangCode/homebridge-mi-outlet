# homebridge-mi-outlet
[![npm version](https://badge.fury.io/js/homebridge-mi-outlet.svg)](https://badge.fury.io/js/homebridge-mi-outlet)

XiaoMi outlet plugins for HomeBridge.   
Thanks for [nfarina](https://github.com/nfarina)(the author of [homebridge](https://github.com/nfarina/homebridge)), [wfr](https://github.com/wfr)(the author of [mihome-binary-protocol](https://github.com/OpenMiHome/mihome-binary-protocol)), [aholstenson](https://github.com/aholstenson)(the author of [miio](https://github.com/aholstenson/miio)), all other developer and testers.   

**Note: I have only a part of these devices, so some devices don't have tested. If you find bugs, please submit them to [issues](https://github.com/YinHangCode/homebridge-mi-outlet/issues) or [QQ Group: 107927710](//shang.qq.com/wpa/qunwpa?idkey=8b9566598f40dd68412065ada24184ef72c6bddaa11525ca26c4e1536a8f2a3d).**   

![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/PlugBase.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/PlugBaseWithUSB.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/IntelligencePinboard.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/QingPinboard.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/QingPinboardWithUSB.jpg)

## Supported Devices
1.PlugBase(米家智能插座基础版)   
2.PlugBaseWithUSB(小米智能插座_USB版)   
3.IntelligencePinboard(米家智能插线板)   
4.QingPinboard(青米智能插线板_五孔位版)   
5.QingPinboardWithUSB(青米智能插线板_USB版)   
## Installation
1. Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md).   
If you are using Raspberry Pi, please read [Running-HomeBridge-on-a-Raspberry-Pi](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi).   
2. Make sure you can see HomeBridge in your iOS devices, if not, please go back to step 1.   
3. Install packages.   
```
npm install -g miio homebridge-mi-outlet
```
## Configuration
```
"platforms": [{
    "platform": "MiOutletPlatform",
    "accessories": [{
        "type": "PlugBase",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "living room outlet",
        "outletDisable": false,
        "temperatureName": "living room outlet temperature",
        "temperatureDisable": false,
        "switchLEDName": "living room led light switch",
        "switchLEDDisable": false
    }, {
        "type": "PlugBaseWithUSB",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "study room outlet",
        "outletDisable": false,
        "temperatureName": "study room outlet temperature",
        "temperatureDisable": false,
        "switchUSBName": "study room led usb switch",
        "switchUSBDisable": false
    }, {
        "type": "IntelligencePinboard",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "master room outlet",
        "outletDisable": false,
        "temperatureName": "master room outlet temperature",
        "temperatureDisable": false,
        "switchLEDName": "master room led light switch",
        "switchLEDDisable": false
    }, {
        "type": "QingPinboard",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "dining room outlet",
        "outletDisable": false,
        "temperatureName": "dining room outlet temperature",
        "temperatureDisable": false
    }, {
        "type": "QingPinboardWithUSB",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "kitchen room outlet",
        "outletDisable": false,
        "temperatureName": "kitchen room outlet temperature",
        "temperatureDisable": false
    }]
}]
```
## Get token
Open command prompt or terminal. Run following command:.
```
miio --discover
```
Wait until you get output similar to this:
```
Device ID: xxxxxxxx   
Model info: Unknown   
Address: 192.168.88.xx   
Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx via auto-token   
Support: Unknown   
```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx is token.
## Version Logs
### 0.2.0
1.add support for Intelligence Pinboard: outlet, temperature sensor, LED switch.   
2.add support for Qing Pinboard: outlet, temperature sensor.   
3.add support for Qing Pinboard With USB: outlet, temperature sensor.   
4.fixed bug that homebridge not works when device is not responding.   
5.optimized code.   
6.fixed bug that run homebridge error there is no MiOutletPlatform in config.json file.   
### 0.1.0
1.add support for PlugBaseWithUSB: outlet, temperature sensor, USB switch.   
2.add PlugBase LED switch.    
### 0.0.1
1.support for PlugBase: outlet, temperature sensor.   
