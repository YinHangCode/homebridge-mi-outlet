# homebridge-mi-outlet
[![npm version](https://badge.fury.io/js/homebridge-mi-outlet.svg)](https://badge.fury.io/js/homebridge-mi-outlet)

XiaoMi outlet plugins for HomeBridge.   
Thanks for [nfarina](https://github.com/nfarina)(the author of [homebridge](https://github.com/nfarina/homebridge)), [wfr](https://github.com/wfr)(the author of [mihome-binary-protocol](https://github.com/OpenMiHome/mihome-binary-protocol)), [aholstenson](https://github.com/aholstenson)(the author of [miio](https://github.com/aholstenson/miio)), all other developer and testers.   

![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/PlugBase.jpg)
![](https://raw.githubusercontent.com/YinHangCode/homebridge-mi-outlet/master/images/PlugBaseWithUSB.jpg)
![](https://github.com/YinHangCode/homebridge-mi-outlet/blob/master/images/IntelligencePinboard.jpg)
![](https://github.com/YinHangCode/homebridge-mi-outlet/blob/master/images/QingPinboard.jpg)
![](https://github.com/YinHangCode/homebridge-mi-outlet/blob/master/images/QingPinboardWithUSB.jpg)

## Supported Devices
1.PlugBase(米家智能插座基础版)   
2.PlugBaseWithUSB(小米智能插座_USB版) ---- coming soon   
3.IntelligencePinboard(米家智能插线板) ---- coming soon   
4.QingPinboard(青米智能插线板_五孔位版) ---- coming soon   
5.QingPinboardWithUSB(青米智能插线板_USB版) ---- coming soon   
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
    "platform": "MiOutlet",
    "accessories": [{
        "type": "PlugBase",
        "ip": "192.168.88.xx",
        "token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "outletName": "living room outlet",
        "outletDisable": false,
        "temperatureName": "living room outlet temperature",
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
### 0.0.1
1.support for PlugBase: outlet, temperature sensor.   
