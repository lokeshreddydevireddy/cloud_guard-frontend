import { Router } from "express";
import { Server } from "../models/Server.js";
import { Alert } from "../models/Alert.js";
import { Log } from "../models/Log.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

function synthTimeline(n, base, variance, seed) {
  let s = seed;
  const rand = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: n }, (_, i) => ({
    t: i,
    label: `${i}m`,
    value: Math.max(0, base + Math.sin(i / 3) * variance * 0.5 + (rand() - 0.5) * variance),
  }));
}

router.get("/", async (_req, res) => {
  const [servers, alerts, recentAlerts] = await Promise.all([
    Server.find(),
    Alert.countDocuments({ status: "open" }),
    Alert.find().sort({ createdAt: -1 }).limit(5),
  ]);

  const regions = new Set(servers.map((s) => s.region).filter(Boolean));
  const healthy = servers.filter((s) => s.status === "healthy").length;
  const warning = servers.filter((s) => s.status === "warning").length;
  const critical = servers.filter((s) => s.status === "critical").length;

  res.json({
    totals: { servers: servers.length, alerts, containers: 0, regions: regions.size },
    healthy,
    warning,
    critical,
    throughput: synthTimeline(30, 500, 250, 42),
    cpuTimeline: synthTimeline(24, 42, 20, 1),
    ramTimeline: synthTimeline(24, 61, 12, 2),
    distribution: [
      { name: "Compute", value: 42 },
      { name: "Storage", value: 18 },
      { name: "Network", value: 22 },
      { name: "AI/ML", value: 18 },
    ],
    recentAlerts,
  });
});

export default router;
