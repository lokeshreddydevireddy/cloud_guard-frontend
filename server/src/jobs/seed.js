/**
 * Seed script: creates an admin user and a handful of servers/alerts so a
 * fresh install has data to display. Run once with `npm run seed`.
 */
import "dotenv/config";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Server } from "../models/Server.js";
import { Alert } from "../models/Alert.js";
import { Log } from "../models/Log.js";
import mongoose from "mongoose";

async function main() {
  await connectDB();

  const email = "admin@cloudvision.ai";
  const existing = await User.findOne({ email });
  const admin = existing ?? await User.create({
    name: "Alex Kepler",
    email,
    password: "ChangeMe123!",
    role: "admin",
    emailVerified: true,
    company: "CloudVision AI",
  });
  console.log(`[seed] admin → ${admin.email} (password: ChangeMe123!)`);

  if ((await Server.countDocuments()) === 0) {
    await Server.insertMany([
      { name: "api-prod-01", hostname: "ec2-a1", ip: "10.0.1.14", operatingSystem: "Ubuntu 22.04", region: "us-east-1", status: "healthy", cpu: 42, ram: 61, disk: 38, temp: 58, uptime: 12_244_800 },
      { name: "worker-eu-02", hostname: "ec2-b2", ip: "10.0.4.31", operatingSystem: "Debian 12", region: "eu-west-2", status: "warning", cpu: 78, ram: 84, disk: 55, temp: 71, uptime: 8_640_000 },
      { name: "db-primary", hostname: "rds-a1", ip: "10.0.2.9", operatingSystem: "Amazon Linux", region: "us-east-1", status: "healthy", cpu: 34, ram: 72, disk: 62, temp: 54, uptime: 25_920_000 },
    ]);
    console.log(`[seed] servers seeded`);
  }

  if ((await Alert.countDocuments()) === 0) {
    await Alert.insertMany([
      { title: "CPU above 90% on cache-asia-01", severity: "critical", status: "open" },
      { title: "RAM usage 84% on worker-eu-02", severity: "warning", status: "open" },
      { title: "Auto-scaling event triggered in eu-west-2", severity: "info", status: "acknowledged" },
    ]);
    console.log(`[seed] alerts seeded`);
  }

  if ((await Log.countDocuments()) === 0) {
    const now = Date.now();
    await Log.insertMany(
      Array.from({ length: 40 }, (_, i) => ({
        level: ["INFO", "WARN", "ERROR", "DEBUG"][i % 4],
        service: ["api", "worker", "db", "gateway"][i % 4],
        message: [
          "Handled request POST /v1/orders in 42ms",
          "Retry attempt 2/3 for job billing.reconcile",
          "Connection reset by peer (10.0.2.9)",
          "Cache hit ratio: 94.2%",
        ][i % 4],
        timestamp: new Date(now - i * 42_000),
      })),
    );
    console.log(`[seed] logs seeded`);
  }

  await mongoose.disconnect();
  console.log("[seed] done");
}

main().catch((err) => { console.error(err); process.exit(1); });
