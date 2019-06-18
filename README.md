# homebridge-mi-outlet
[![npm version](https://badge.fury.io/js/homebridge-mi-outlet.svg)](https://badge.fury.io/js/homebridge-mi-outlet)

XiaoMi outlet plugins for HomeBridge.   
   
Thanks for [nfarina](https://github.com/nfarina)(the author of [homebridge](https://github.com/nfarina/homebridge)), [OpenMiHome](https://github.com/OpenMiHome/mihome-binary-protocol), [aholstenson](https://github.com/aholstenson)(the author of [miio](https://github.com/aholstenson/miio)), all other developer and testers.   
   
**Note: I have only a part of these devices, so some devices don't have tested. If you find bugs, please submit them to [issues](https://github.com/YinHangCode/homebridge-mi-outlet/issues) or [QQ Group: 107927710](//shang.qq.com/wpa/qunwpa?idkey=8b9566598f40dd68412065ada24184ef72c6bddaa11525ca26c4e1536a8f2a3d).**   

![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/PlugBase.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/PlugBaseWithUSB.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/IntelligencePinboard.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/QingPinboard.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/QingPinboardWithUSB.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/MiPlugBaseEnhanced.jpg)

## Supported Devices
1. MiPlugBase(米家智能插座基础版)   
2. MiPlugBaseWithUSB(小米智能插座_USB版)   
3. MiIntelligencePinboard(米家智能插线板)   
4. MiQingPinboard(青米智能插线板_五孔位版)   
5. MiQingPinboardWithUSB(青米智能插线板_USB版)   
6. MiPlugBaseEnhanced(米家智能插座增强版)   

## Installation
1. Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md).   
If you are using Raspberry Pi, please read [Running-HomeBridge-on-a-Raspberry-Pi](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi).   
2. Make sure you can see HomeBridge in your iOS devices, if not, please go back to step 1.   
3. Install packages.   
```
npm install -g homebridge-xiaomi-outlet
```
## Configuration
```
"platforms": [{
    "platform": "MiOutletPlatform",
    "deviceCfgs": [{
        "type": "MiPlugBase",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "living room outlet",
        "outletDisable": false,
        "temperatureName": "living room outlet temperature",
        "temperatureDisable": false,
        "switchLEDName": "living room led light switch",
        "switchLEDDisable": true
    }, {
        "type": "MiPlugBaseWithUSB",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "study room outlet",
        "outletDisable": false,
        "temperatureName": "study room outlet temperature",
        "temperatureDisable": false,
        "switchUSBName": "study room outlet usb switch",
        "switchUSBDisable": false
    }, {
        "type": "MiIntelligencePinboard",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "master room outlet",
        "outletDisable": false,
        "temperatureName": "master room outlet temperature",
        "temperatureDisable": false,
        "switchLEDName": "master room led light switch",
        "switchLEDDisable": true
    }, {
        "type": "MiQingPinboard",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "dining room outlet",
        "outletDisable": false,
        "temperatureName": "dining room outlet temperature",
        "temperatureDisable": false
    }, {
        "type": "MiQingPinboardWithUSB",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "kitchen room outlet",
        "outletDisable": false,
        "temperatureName": "kitchen room outlet temperature",
        "temperatureDisable": false
    }, {
        "type": "MiPlugBaseEnhanced",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "living room outlet2",
        "outletDisable": false,
        "temperatureName": "living room outlet2 temperature",
        "temperatureDisable": false,
        "switchUSBName": "living room outlet2 usb switch",
        "switchUSBDisable": false,
        "switchLEDName": "living room outlet2 led light switch",
        "switchLEDDisable": true
    }]
}]
```
## Get token
### Get token by miio2.db (Recommend)
setup MiJia(MiHome) app in your android device or android virtual machine.   
open MiJia(MiHome) app and login your account.   
refresh device list and make sure device display in the device list.   
get miio2.db(path: /data/data/com.xiaomi.smarthome/databases/miio2.db) file from your android device or android virtual machine.   
open website [[Get MiIo Tokens By DataBase File](http://miio2.yinhh.com/)], upload miio2.db file and submit.    
### Get token by network
Open command prompt or terminal. Run following command:
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
"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" is token.   
If token is "???", then reset device and connect device created Wi-Fi hotspot.   
Run following command:   
```
miio --discover --sync
```
Wait until you get output.   
For more information about token, please refer to [OpenMiHome](https://github.com/OpenMiHome/mihome-binary-protocol) and [miio](https://github.com/aholstenson/miio).   
## Version Logs
### 0.3.0 (2018-09-10)
1. add support for Mi PlugBase Enhanced: outlet, temperature sensor, LED switch, USB switch.   
### 0.2.8 (2018-02-10)
1. update 'package.json'.   
### 0.2.7 (2017-11-18)
1. modify class name, reduce the probability of conflicts due to the same class name and other plugins.   
### 0.2.6 (2017-09-11)
1. optimized code.   
### 0.2.5 (2017-09-05)
1. optimized code.   
### 0.2.4 (2017-08-31)
1. add outlet inuse display.    
### 0.2.3 (2017-08-30)
1. fixed bug that 'log of undefined' error.    
2. config item 'accessories' renamed 'deviceCfgs'.   
### 0.2.2 (2017-08-29)
1. fixed bug that many of the same type of device conflict with each other.   
### 0.2.1 (2017-08-27)
1. optimized code.   
### 0.2.0 (2017-08-26)
1. add support for Intelligence Pinboard: outlet, temperature sensor, LED switch.   
2. add support for Qing Pinboard: outlet, temperature sensor.   
3. add support for Qing Pinboard With USB: outlet, temperature sensor.   
4. fixed bug that homebridge not works when device is not responding.   
5. optimized code.   
6. fixed bug that run homebridge error there is no MiOutletPlatform in config.json file.   
### 0.1.0 (2017-08-25)
1. add support for PlugBaseWithUSB: outlet, temperature sensor, USB switch.   
2. add PlugBase LED switch.    
### 0.0.1 (2017-08-24)
1. support for PlugBase: outlet, temperature sensor.   
