import { Server as IOServer } from "socket.io";
import { verifyAccess } from "../utils/jwt.js";
import { config } from "../config/env.js";

/**
 * Real-time updates hub. Clients pass their access token as `auth.token`.
 * Extend by emitting `alerts:new`, `logs:new`, or `server:update` from any
 * controller via `io.emit(...)`.
 */
export function initSocket(httpServer) {
  const io = new IOServer(httpServer, {
    cors: { origin: config.clientUrl, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const decoded = verifyAccess(token);
      socket.data.userId = decoded.sub;
      socket.data.role = decoded.role;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`[socket] client connected ${socket.data.userId}`);
    socket.on("disconnect", () => {
      console.log(`[socket] client disconnected ${socket.data.userId}`);
    });
  });

  return io;
}
