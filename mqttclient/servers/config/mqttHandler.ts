import mqtt from "mqtt";

let client: mqtt.MqttClient;
client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("✅ MQTT Connected");
});

client.on("error", (err) => {
  console.error("❌ MQTT Error:", err);
});

export function getClient(): mqtt.MqttClient {
  return client;
}

export function subscribeTopic(topic: string) {
  const c = getClient();

  c.subscribe(topic, (err: any) => {
    if (err) {
      console.log(`ERROR: Subscribe na ${topic} \n`);
    }
    else {
      console.log(`SUCCESS: Subscribe na ${topic} \n`);
    }
  });
}