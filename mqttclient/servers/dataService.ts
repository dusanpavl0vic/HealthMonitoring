import mqtt from "mqtt";
import { Server } from 'socket.io';

console.log("Connecting to MQTT broker...");
const mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on("connect", () => {
  console.log("MQTT Connected to localhost:1883");
  mqttClient.subscribe("health/data", (err) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log("Subscribed to topic: health/data");
    }
  });
});

mqttClient.on("error", (err) => {
  console.error("MQTT Error:", err);
});

console.log("Starting WebSocket server...");
const io = new Server(3002, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
console.log("WebSocket server running on port 3002");

interface HealthRecord {
  athleteId: string;
  timestamp: string;
  heartRate: number;
  bodyTemperature: number;
  bloodPressure: string;
  bloodOxygen: number;
  stepCount: number;
  activityStatus: number;
  latitude: number;
  longitude: number;
  secureTransmissionStatus: number;
}

interface ValidationMessage {
  type: "warning" | "critical";
  message: string;
  value?: any;
}

interface ValidationResult {
  record: HealthRecord;
  messages: ValidationMessage[];
}

const healthHistory: Map<string, ValidationResult[]> = new Map();

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
    console.log(data);
  } catch (e) {
    console.error("Invalid JSON from MQTT:", e);
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("get_history", (athleteId: string) => {
    const history = healthHistory.get(athleteId) || [];
    socket.emit("history_data", { athleteId, history });
    console.log(`Sent history for athlete ${athleteId}: ${history.length} records`);
  });

  socket.on("get_all_athletes", () => {
    const athletes = Array.from(healthHistory.keys());
    socket.emit("athletes_list", athletes);
    console.log(`Sent athletes list: ${athletes.length} athletes`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

console.log("Data service started successfully!");
console.log("MQTT: localhost:1883");
console.log("WebSocket: localhost:3002");
console.log("Waiting for data...");

