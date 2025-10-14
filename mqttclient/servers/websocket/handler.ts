import { ValidationResult } from '@/interfaces/healthData';
import mqtt from 'mqtt';
import { io } from '../websocket/server';

const healthHistory: Map<string, ValidationResult[]> = new Map();

export function setupMQTTMessageHandler(mqttClient: mqtt.MqttClient, topic: string) {
  mqttClient.subscribe(topic, (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });

  mqttClient.on("message", (topic, message) => {
    try {
      const data: ValidationResult = JSON.parse(message.toString());
      console.log("MQTT data received for athlete:", data.record.athleteId);

      const athleteId = data.record.athleteId;
      if (!healthHistory.has(athleteId)) {
        healthHistory.set(athleteId, []);
        console.log(`New athlete registered: ${athleteId}`);
      }

      const history = healthHistory.get(athleteId)!;
      history.push(data);

      if (history.length > 50) {
        history.shift();
      }

      io.emit("health_update", data);
      console.log(`Sent update to clients for athlete: ${athleteId}`);

    } catch (e) {
      console.error("Invalid JSON from MQTT:", e);
    }
  });
}

export function setupNATSHandler(nc: any, topic: string) {
  try {
    const sub = nc.subscribe(topic);

    (async () => {
      for await (const msg of sub) {
        const data = msg.string();

        const parsedData: NatsMessage = JSON.parse(data);
        io.emit("health_predicted_activity", parsedData);
        console.log(`[NATS] Received message:`, parsedData);
      }
    })().catch(err => {
      console.error('Error in NATS subscription loop:', err);
    });

    return sub;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}