import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
export function getSocket() {
  return io;
}
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("ping", () => {
    console.log("Dobio ping od", socket.id);
    socket.emit("pong", { msg: "Pong!" });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Server running on http://localhost:3002");
});
