const prepareDiscoveryQbusSwitch = (functionBlock, controllerId) => {
  const device = {
    identifiers: 'Qbus switch',
    name: 'Qbus switches',
    model: 'switch',
    manufacturer: 'Qbus',
    sw_version: '0.1.0',
  };
  const itemNameWithoutSpaces = functionBlock.name.split(' ').join('_');
  const haRequest = {
    name: functionBlock.name,
    object_id: itemNameWithoutSpaces,
    unique_id: itemNameWithoutSpaces,
    device,
    retain: false,
    qos: 0,
    state_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/state`,
    value_template: '{{value_json["properties"]["value"] if value_json["properties"]["value"] is defined else (states(entity_id)) }}',
    state_on: true,
    state_off: false,
    command_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/setState`,
    payload_on: `{"id": "${functionBlock.id}","type": "state","properties": {"value": true}}`,
    payload_off: `{"id": "${functionBlock.id}","type": "state","properties": {"value": false}}`,
  };
  const mqttTopic = `homeassistant/switch/qbus/${itemNameWithoutSpaces}/config`;
  return { haRequest, mqttTopic };
};

const prepareDiscoveryQbusLight = (functionBlock, controllerId) => {
  const device = {
    identifiers: 'Qbus dimmer',
    name: 'Qbus dimmers',
    model: 'light',
    manufacturer: 'Qbus',
    sw_version: '0.1.0',
  };
  const itemNameWithoutSpaces = functionBlock.name.split(' ').join('_');
  const haRequest = {
    name: functionBlock.name,
    object_id: itemNameWithoutSpaces,
    unique_id: itemNameWithoutSpaces,
    device,
    retain: false,
    qos: 0,
    schema: 'template',
    brightness_template: '{{ value_json.properties.value | float | multiply(2.55) | round(0) }}',
    state_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/state`,
    state_template: '{%- if value_json.properties.value > 0 -%} on {%- else -%} off {%- endif -%}',
    command_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/setState`,
    command_on_template: `{%- if brightness is defined -%} {"id":"${functionBlock.id}","type":"state","properties":{"value":{{brightness | float | multiply(0.39215686) | round(0)}}}} {%- else -%} {"id":"${functionBlock.id}","type":"state","properties":{"value":100}} {%- endif -%} }`,
    command_off_template: `{"id":"${functionBlock.id}", "type": "state", "properties": {"value": 0}}`,
  };
  const mqttTopic = `homeassistant/light/qbus/${itemNameWithoutSpaces}/config`;
  return { haRequest, mqttTopic };
};

const prepareDiscoveryQbusCoverUpDown = (functionBlock, controllerId) => {
  const device = {
    identifiers: 'Qbus cover',
    name: 'Qbus shutters',
    model: 'cover',
    manufacturer: 'Qbus',
    sw_version: '0.1.0',
  };
  const itemNameWithoutSpaces = functionBlock.name.split(' ').join('_');
  const haRequest = {
    name: functionBlock.name,
    object_id: itemNameWithoutSpaces,
    unique_id: itemNameWithoutSpaces,
    device,
    retain: false,
    qos: 0,
    command_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/setState`,
    payload_close: `{"id":"${functionBlock.id}", "type": "state", "properties": {"state": "down"}}`,
    payload_open: `{"id":"${functionBlock.id}", "type": "state", "properties": {"state": "up"}}`,
    payload_stop: `{"id":"${functionBlock.id}", "type": "state", "properties": {"state": "stop"}}`,
    state_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/state`,
    state_closing: 'down',
    state_opening: 'up',
    state_stopped: 'stop',
    value_template: '{{value_json["properties"]["state"] if value_json["properties"]["state"] is defined else (states(entity_id)) }}',
  };
  const mqttTopic = `homeassistant/cover/qbus/${itemNameWithoutSpaces}/config`;
  return { haRequest, mqttTopic };
};

const prepareDiscoveryQbusCoverPos = (functionBlock, controllerId) => {
  const device = {
    identifiers: 'Qbus cover',
    name: 'Qbus shutters',
    model: 'cover',
    manufacturer: 'Qbus',
    sw_version: '0.1.0',
  };
  const itemNameWithoutSpaces = functionBlock.name.split(' ').join('_');
  const haRequest = {
    name: functionBlock.name,
    object_id: itemNameWithoutSpaces,
    unique_id: itemNameWithoutSpaces,
    device,
    retain: false,
    qos: 0,
    command_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/setState`,
    payload_close: `{"id":"${functionBlock.id}", "type": "state", "properties": {"shutterPosition": 0}}`,
    payload_open: `{"id":"${functionBlock.id}", "type": "state", "properties": {"shutterPosition": 100}}`,
    state_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/state`,
    state_closed: 'off',
    state_open: 'on',
    value_template: "{% if value_json['properties']['shutterPosition'] == 0 %}off{% else %}on{% endif %}",
    position_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/state`,
    position_template: '{{value_json["properties"]["shutterPosition"] if value_json["properties"]["shutterPosition"] is defined else (states(entity_id)) }}',
    position_open: 100,
    position_closed: 0,
    set_position_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/setState`,
    set_position_template: `{%- if position is defined -%} {"id":"${functionBlock.id}","type":"state","properties":{"shutterPosition":{{position| float | round(0)}}}} {%- else -%} {"id":"${functionBlock.id}","type":"state","properties":{"shutterPosition":100}} {%- endif -%} }`,
  };
  const mqttTopic = `homeassistant/cover/qbus/${itemNameWithoutSpaces}/config`;
  return { haRequest, mqttTopic };
};

const prepareDiscoveryQbusCover = (functionBlock, controllerId) => {
  if (functionBlock.properties.shutterPosition !== undefined) {
    return prepareDiscoveryQbusCoverPos(functionBlock, controllerId);
  }
  return prepareDiscoveryQbusCoverUpDown(functionBlock, controllerId);
};

const prepareDiscoveryQbusClimate = (functionBlock, controllerId) => {
  const device = {
    identifiers: 'Qbus climate',
    name: 'Qbus thermostats',
    model: 'climate',
    manufacturer: 'Qbus',
    sw_version: '0.1.0',
  };
  const itemNameWithoutSpaces = functionBlock.name.split(' ').join('_');
  const haRequest = {
    name: functionBlock.name,
    object_id: itemNameWithoutSpaces,
    unique_id: itemNameWithoutSpaces,
    device,
    retain: false,
    qos: 0,
    action_topic: `qbus/${itemNameWithoutSpaces}/action`,
    current_temperature_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/state`,
    current_temperature_template: '{{value_json["properties"]["currTemp"] if value_json["properties"]["currTemp"] is defined else (states(entity_id)) }}',
    // modes: ['auto', 'off'],
    // mode_command_topic: `qbus/${itemNameWithoutSpaces}/mode`,
    // mode_command_template: '{{value}}',
    // mode_state_topic: `qbus/${itemNameWithoutSpaces}/mode`,
    precision: 0.5,
    preset_mode_command_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/setState`,
    preset_mode_command_template: `{"id":"${functionBlock.id}","type":"state","properties":{"currRegime":"{{value}}"}}`,
    preset_mode_state_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/state`,
    preset_mode_value_template: '{{value_json["properties"]["currRegime"] if value_json["properties"]["currRegime"] is defined else (states(entity_id)) }}',
    preset_modes: ['MANUEEL', 'VORST', 'ECONOMY', 'COMFORT', 'NACHT'],
    temperature_command_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/setState`,
    temperature_command_template: `{"id":"${functionBlock.id}", "type": "state", "properties": {"setTemp": {{value}} }}`,
    temperature_state_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/state`,
    temperature_state_template: '{{value_json["properties"]["setTemp"] if value_json["properties"]["setTemp"] is defined else (states(entity_id)) }}',
    temperature_unit: 'C',
    temp_step: 0.5,
  };
  const mqttTopic = `homeassistant/climate/qbus/${itemNameWithoutSpaces}/config`;
  return { haRequest, mqttTopic };
};

const prepareDiscoveryQbusScene = (functionBlock, controllerId) => {
  const device = {
    identifiers: 'Qbus scene',
    name: 'Qbus scenes',
    model: 'scene',
    manufacturer: 'Qbus',
    sw_version: '0.1.0',
  };
  const itemNameWithoutSpaces = functionBlock.name.split(' ').join('_');
  const haRequest = {
    name: functionBlock.name,
    object_id: itemNameWithoutSpaces,
    unique_id: itemNameWithoutSpaces,
    device,
    retain: false,
    qos: 0,
    command_topic: `cloudapp/QBUSMQTTGW/${controllerId}/${functionBlock.id}/setState`,
    payload_on: `{"id":"${functionBlock.id}","type":"action","action":"active"}`,
  };
  const mqttTopic = `homeassistant/scene/qbus/${itemNameWithoutSpaces}/config`;
  return { haRequest, mqttTopic };
};

module.exports.prepareDiscoveryQbusSwitch = prepareDiscoveryQbusSwitch;
module.exports.prepareDiscoveryQbusLight = prepareDiscoveryQbusLight;
module.exports.prepareDiscoveryQbusCover = prepareDiscoveryQbusCover;
module.exports.prepareDiscoveryQbusClimate = prepareDiscoveryQbusClimate;
module.exports.prepareDiscoveryQbusScene = prepareDiscoveryQbusScene;
