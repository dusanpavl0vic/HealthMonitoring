import mqtt from "mqtt";

console.log("Connecting to MQTT broker...");

function clienMqtt() {
  const mqttClient = mqtt.connect("mqtt://localhost:1883");

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");
  });

  mqttClient.on("error", (err) => {
    console.error("MQTT Error:", err);
  });

  mqttClient.on('disconnect', () => {
    console.log('Disconnected from MQTT broker');
  });

  return mqttClient;
}

export { clienMqtt };



