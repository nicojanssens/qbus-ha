const mqtt = require('mqtt');
const mqttArgs = require('./lib/Constants').mqtt;
const {
  prepareDiscoveryQbusSwitch,
  prepareDiscoveryQbusLight,
  prepareDiscoveryQbusCover,
  prepareDiscoveryQbusClimate,
  prepareDiscoveryQbusScene,
} = require('./lib/Discoveries');

const configTopic = 'cloudapp/QBUSMQTTGW/config';
const requestConfigTopic = 'cloudapp/QBUSMQTTGW/getConfig';
const client = mqtt.connect(mqttArgs.uri, {
  username: mqttArgs.username,
  password: mqttArgs.password,
});

const sendMqttMessage = (discoveryConfig) => {
  const config = { qos: 0, retain: false };
  const topic = discoveryConfig.mqttTopic;
  const message = JSON.stringify(discoveryConfig.haRequest);
  client.publish(topic, message, config, (error) => {
    if (error) {
      console.error(error);
    }
  });
};

client.on('connect', () => {
  console.log(`connected to ${mqttArgs.uri}`);
  client.subscribe(configTopic, (subscribeError) => {
    if (!subscribeError) {
      console.log(`subscribed to topic ${configTopic}`);
      const now = new Date();
      const nowQbusFormat = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      const request = {
        app: 'UbieLite',
        devices: [],
        version: nowQbusFormat,
      };
      const config = { qos: 0, retain: false };
      client.publish(requestConfigTopic, JSON.stringify(request), config, (publishError) => {
        if (publishError) {
          console.error(publishError);
        }
      });
    }
  });
});

client.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  if (data.devices === undefined) {
    process.stdout.write('.');
    return;
  }
  if (data.devices.length === 0) {
    process.stdout.write('.');
    return;
  }

  data.devices.forEach((device) => {
    const { functionBlocks } = device;
    if (functionBlocks.length === 0) {
      process.stdout.write('.');
      return;
    }
    functionBlocks.forEach((functionBlock) => {
      switch (functionBlock.type) {
        case 'onoff': {
          process.stdout.write('o');
          const discoveryConfig = prepareDiscoveryQbusSwitch(functionBlock, device.id);
          sendMqttMessage(discoveryConfig);
          break;
        }
        case 'analog': {
          process.stdout.write('a');
          const discoveryConfig = prepareDiscoveryQbusLight(functionBlock, device.id);
          sendMqttMessage(discoveryConfig);
          break;
        }
        case 'shutter': {
          process.stdout.write('s');
          const discoveryConfig = prepareDiscoveryQbusCover(functionBlock, device.id);
          sendMqttMessage(discoveryConfig);
          break;
        }
        case 'thermo': {
          process.stdout.write('t');
          const discoveryConfig = prepareDiscoveryQbusClimate(functionBlock, device.id);
          sendMqttMessage(discoveryConfig);
          break;
        }
        case 'scene': {
          process.stdout.write('s');
          const discoveryConfig = prepareDiscoveryQbusScene(functionBlock, device.id);
          sendMqttMessage(discoveryConfig);
          break;
        }
        default:
          console.error(`Don't know how to process ${functionBlock.type}.`);
      }
    });
  });
});
