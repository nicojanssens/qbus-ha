# Script to register Qbus MQTT items with Home Assistant #

Small script to scan your Qbus MQTT topics and register them as HA items.


## Install

`npm install`

Create .env including the variables defined in .env.example


## Prerequisites

* An operational Qbus installation. 
* QbusMQTT bridge connecting Qbus controller with an MQTT server. See also https://github.com/thomasddn/qbusmqt, https://github.com/wk275/qbTools-v2 and https://github.com/QbusKoen/QbusMqtt-installer. 
* An operational Home Assistant setup. 


## Remarks

:warning: This library is not officially supported by Qbus.

## Thanks

to https://github.com/wk275 for sharing the qbTools libraries, which have been a great source of information while defining this script.