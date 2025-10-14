import { clienMqtt } from "./mqtt/client";
import { clientNats } from "./nats/client";
import { setupMQTTMessageHandler, setupNATSHandler } from "./websocket/handler";

const mqttClient = clienMqtt();

console.log("🚀 Starting server...");
setupMQTTMessageHandler(mqttClient, "health/data");

console.log("Server started successfully");
console.log("WebSocket server running on port 3002");
console.log("MQTT client connected to localhost:1883");
console.log("Listening for MQTT messages on topic: health/data");

async function natsSetup() {
  try {
    const natsClient = await clientNats();
    setupNATSHandler(natsClient, "athlete/predictions");
    console.log('NATS handler setup completed');
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}
natsSetup();
