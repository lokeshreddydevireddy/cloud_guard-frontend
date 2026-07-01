import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { ZodError } from "zod";

import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { initSocket } from "./socket/index.js";
import { startJobs } from "./jobs/index.js";

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import serverRoutes from "./routes/servers.js";
import alertRoutes from "./routes/alerts.js";
import logRoutes from "./routes/logs.js";
import notificationRoutes from "./routes/notifications.js";
import settingsRoutes from "./routes/settings.js";
import agentRoutes from "./routes/agent_routes.js";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

// Rate-limit auth endpoints
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get("/api/health", (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/servers", serverRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/agent", agentRoutes);

// Turn ZodError into a 400 with details
app.use((err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Invalid input", details: err.flatten() });
  }
  next(err);
});

app.use(notFound);
app.use(errorHandler);

const httpServer = http.createServer(app);
initSocket(httpServer);

connectDB()
  .then(() => {
    startJobs();
    httpServer.listen(config.port, () => {
      console.log(`[api] listening on http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.error("[fatal] failed to connect to Mongo:", err.message);
    process.exit(1);
  });
