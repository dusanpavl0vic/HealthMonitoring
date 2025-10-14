import { clienMqtt } from "./mqtt/client";
import { setupMQTTMessageHandler } from "./websocket/handler";

const mqttClient = clienMqtt();

console.log("🚀 Starting server...");
setupMQTTMessageHandler(mqttClient, "health/data");

console.log("Server started successfully");
console.log("WebSocket server running on port 3002");
console.log("MQTT client connected to localhost:1883");
console.log("Listening for MQTT messages on topic: health/data");



