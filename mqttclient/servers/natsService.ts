import { connect, StringCodec } from "nats";
import { Server } from "socket.io";

console.log("Connecting to NATS broker...");
const sc = StringCodec();

const nc = await connect({
  servers: "nats://localhost:4222",
});

console.log("Connected to NATS broker (localhost:4222)");

interface HealthRecord {
  heartRate: number;
  bodyTemperature: number;
  bloodPressure: string;
  bloodOxygen: number;
  stepCount: number;
}

interface Prediction {
  predicted_activity: string;
  confidence: number;
  error: string;
}

interface AthletePredictResponse {
  athleteId: string;
  timestamp: string;
  healthRecord: HealthRecord;
  prediction: Prediction;
}

const healthHistory: Map<string, AthletePredictResponse[]> = new Map();

// 🎧 WebSocket server
console.log("Starting WebSocket server...");
const io = new Server(3002, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
console.log("✅ WebSocket running on port 3002");

// 📡 Subscribuj se na NATS temu
const sub = nc.subscribe("athlete/predictions");

(async () => {
  console.log("Subscribed to topic: athlete/predictions");
  for await (const msg of sub) {
    try {
      const data: AthletePredictResponse = JSON.parse(sc.decode(msg.data));
      const { athleteId } = data;

      if (!healthHistory.has(athleteId)) {
        healthHistory.set(athleteId, []);
        console.log(`New athlete registered: ${athleteId}`);
      }

      const history = healthHistory.get(athleteId)!;
      history.push(data);
      if (history.length > 50) history.shift();

      io.emit("health_update_nats", data);
      console.log(`✅ Update sent for athlete: ${athleteId}`);
    } catch (err) {
      console.error("Invalid JSON from NATS:", err);
    }
  }
})();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("get_history", (athleteId: string) => {
    const history = healthHistory.get(athleteId) || [];
    socket.emit("history_data", { athleteId, history });
  });

  socket.on("get_all_athletes", () => {
    const athletes = Array.from(healthHistory.keys());
    socket.emit("athletes_list", athletes);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

console.log("🚀 NATS data service started!");
