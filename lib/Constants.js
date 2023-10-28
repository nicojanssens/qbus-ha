require('dotenv').config();

// verify if required MQTT env variable is set
if (!process.env.MQTT_URI) { throw new Error('MQTT_URI is undefined'); }

// set defaults if not specified
const MQTT_USER = process.env.MQTT_USER || '';
const MQTT_PWD = process.env.MQTT_PWD || '';

// export MQTT env vatiables
const mqtt = {
  uri: process.env.MQTT_URI,
  username: MQTT_USER,
  password: MQTT_PWD,
};
console.log(`mqtt settings: ${JSON.stringify(mqtt)}`);
module.exports.mqtt = mqtt;
