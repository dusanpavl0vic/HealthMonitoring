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

//TODO: nats handler
// export function setupNATSHandler(ws: WebSocket, natsClient: any) {
//   const stringCodec = StringCodec();

//   const subscriptions = ['updates', 'notifications', 'events'];

//   subscriptions.forEach(subject => {
//     try {
//       const subscription = natsClient.subscribe(subject);

//       (async () => {
//         for await (const msg of subscription) {
//           console.log(`📨 NATS message received on ${msg.subject}:`, stringCodec.decode(msg.data));

//           const payload = {
//             type: 'nats-message',
//             subject: msg.subject,
//             data: stringCodec.decode(msg.data),
//             timestamp: new Date().toISOString()
//           };

//           if (ws.readyState === WebSocket.OPEN) {
//             ws.send(JSON.stringify(payload));
//           }
//         }
//       })().catch(err => {
//         console.error(`NATS subscription error for ${subject}:`, err);
//       });

//       console.log(`Subscribed to NATS subject: ${subject}`);

//     } catch (error) {
//       console.error(`Failed to subscribe to NATS subject ${subject}:`, error);
//     }
//   });
// }