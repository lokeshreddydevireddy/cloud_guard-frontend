import "dotenv/config";

const required = ["JWT_SECRET", "JWT_REFRESH_SECRET", "MONGODB_URI"];
for (const key of required) {
  if (!process.env[key]) {
    // Warn only — allow booting for local dev with defaults
    console.warn(`[env] ${key} is not set — using an insecure default. Set it in .env for production.`);
  }
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/cloudvision",
  jwt: {
    accessSecret: process.env.JWT_SECRET ?? "dev-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret",
    accessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
    refreshTtl: process.env.JWT_REFRESH_TTL ?? "7d",
  },
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from: process.env.SMTP_FROM ?? "CloudVision <no-reply@cloudvision.ai>",
  },
};
