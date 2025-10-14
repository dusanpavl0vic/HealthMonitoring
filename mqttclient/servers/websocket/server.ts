import { Server } from "socket.io";

const io = new Server(3002, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

export { io };
