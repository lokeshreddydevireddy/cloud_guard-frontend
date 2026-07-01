// Hermes AI Cloud Copilot — service layer.
// Reuses existing models/functions. Read-only in Phase 1.
import { Server } from "../models/Server.js";
import { Alert } from "../models/Alert.js";
import { Log } from "../models/Log.js";

// -------- Tool functions (reuse existing data sources) --------

export async function get_inventory() {
  const servers = await Server.find().lean();
  const byRegion = servers.reduce((acc, s) => {
    const key = s.region || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return {
    total: servers.length,
    running: servers.filter((s) => s.status !== "offline").length,
    offline: servers.filter((s) => s.status === "offline").length,
    byRegion,
    services: ["EC2", "RDS", "S3", "Lambda", "EBS", "Load Balancers"],
  };
}

export async function get_costs() {
  const servers = await Server.find().lean();
  // Synthetic cost model based on server sizes/status (no external AWS call).
  const items = servers.map((s) => ({
    id: String(s._id),
    name: s.name,
    region: s.region,
    monthly: Math.round((s.cpu * 0.6 + s.ram * 0.4 + 20) * 1.7),
  }));
  const total = items.reduce((sum, i) => sum + i.monthly, 0);
  const top = [...items].sort((a, b) => b.monthly - a.monthly)[0];
  return { total, currency: "USD", items, topSpender: top };
}

export async function get_credits() {
  return { available: 0, note: "No promotional credits attached to this account." };
}

export async function get_recommendations() {
  const servers = await Server.find().lean();
  const recs = [];
  const idle = servers.filter((s) => s.cpu < 10 && s.status !== "offline");
  if (idle.length) recs.push(`Stop ${idle.length} idle instance(s) (CPU < 10%).`);
  const bigDisks = servers.filter((s) => s.disk > 85);
  if (bigDisks.length) recs.push(`Free up storage on ${bigDisks.length} server(s) (disk > 85%).`);
  const hotRam = servers.filter((s) => s.ram > 90);
  if (hotRam.length) recs.push(`Upsize memory on ${hotRam.length} server(s) (RAM > 90%).`);
  recs.push("Consider Savings Plans for steady-state compute.");
  recs.push("Remove unattached EBS volumes and unused Elastic IPs.");
  return recs;
}

export async function get_health_analysis() {
  const [servers, openAlerts] = await Promise.all([
    Server.find().lean(),
    Alert.countDocuments({ status: "open" }),
  ]);
  const issues = [];
  servers
    .filter((s) => s.cpu > 85)
    .forEach((s) => issues.push({ type: "high_cpu", server: s.name, value: s.cpu }));
  servers
    .filter((s) => s.disk > 90)
    .forEach((s) => issues.push({ type: "storage_warning", server: s.name, value: s.disk }));
  servers
    .filter((s) => s.cpu < 5 && s.ram < 10)
    .forEach((s) => issues.push({ type: "underutilized", server: s.name }));
  return { openAlerts, issues };
}

export async function cost_estimator({ hours = 720, servers: n = 1, size = "medium" } = {}) {
  const perHour = { small: 0.023, medium: 0.048, large: 0.096, xlarge: 0.192 }[size] ?? 0.048;
  const monthly = +(perHour * hours * n).toFixed(2);
  return { monthly, perHour, hours, servers: n, size, currency: "USD" };
}

export async function log_analyzer({ minutes = 60 } = {}) {
  const since = new Date(Date.now() - minutes * 60_000);
  const logs = await Log.find({ timestamp: { $gte: since } }).lean();
  const byLevel = logs.reduce((acc, l) => {
    acc[l.level] = (acc[l.level] || 0) + 1;
    return acc;
  }, {});
  return { window: `${minutes}m`, total: logs.length, byLevel };
}

// -------- Intent routing --------

const INTENTS = [
  { name: "cost", re: /\b(bill|cost|spend|expensive|price|charge)/i },
  { name: "inventory", re: /\b(inventory|resources?|services?|ec2|rds|s3|list|how many|running)/i },
  { name: "optimize", re: /\b(reduce|optimi[sz]e|save|cheaper|cut|lower)/i },
  { name: "health", re: /\b(health|issue|problem|alert|down|error|warn)/i },
  { name: "logs", re: /\b(log|logs|trace|stack|exception)/i },
  { name: "estimate", re: /\b(estimate|forecast|project)/i },
];

export function detectIntent(text) {
  const match = INTENTS.find((i) => i.re.test(text));
  return match?.name ?? "general";
}

function fmtUSD(n) {
  return `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

// -------- High-level chat handler --------

export async function runChat({ message }) {
  const intent = detectIntent(message);

  if (intent === "cost") {
    const costs = await get_costs();
    const top = costs.topSpender;
    const share = top ? Math.round((top.monthly / Math.max(1, costs.total)) * 100) : 0;
    return {
      intent,
      message: top
        ? `Your estimated monthly spend is ${fmtUSD(costs.total)}. ${top.name} in ${top.region || "unknown"} is your top spender at ${fmtUSD(top.monthly)} (${share}% of total).`
        : `Your estimated monthly spend is ${fmtUSD(costs.total)}.`,
      recommendations: [],
      metadata: { costs },
    };
  }

  if (intent === "inventory") {
    const inv = await get_inventory();
    return {
      intent,
      message: `You have ${inv.total} tracked resource(s): ${inv.running} running, ${inv.offline} offline across ${Object.keys(inv.byRegion).length} region(s).`,
      recommendations: [],
      metadata: { inventory: inv },
    };
  }

  if (intent === "optimize") {
    const recs = await get_recommendations();
    return {
      intent,
      message: `Here are ${recs.length} ways to reduce cost and improve efficiency.`,
      recommendations: recs,
      metadata: {},
    };
  }

  if (intent === "health") {
    const health = await get_health_analysis();
    return {
      intent,
      message: health.issues.length
        ? `I found ${health.issues.length} issue(s) and ${health.openAlerts} open alert(s).`
        : `No critical issues detected. ${health.openAlerts} open alert(s).`,
      recommendations: [],
      metadata: health,
    };
  }

  if (intent === "logs") {
    const logs = await log_analyzer({ minutes: 60 });
    return {
      intent,
      message: `In the last hour I processed ${logs.total} log entries.`,
      recommendations: [],
      metadata: logs,
    };
  }

  if (intent === "estimate") {
    const est = await cost_estimator();
    return {
      intent,
      message: `Estimated monthly cost: ${fmtUSD(est.monthly)} (${est.servers}× ${est.size} for ${est.hours}h).`,
      recommendations: [],
      metadata: est,
    };
  }

  return {
    intent,
    message:
      "Hi, I'm Hermes — your cloud copilot. Ask me about costs, inventory, health, optimization, logs, or forecasts.",
    recommendations: [
      "Why is my cloud bill high?",
      "How many servers are running?",
      "How can I reduce costs?",
      "Any issues in my account?",
    ],
    metadata: {},
  };
}

export async function runAnalyze() {
  const [inv, costs, health, recs] = await Promise.all([
    get_inventory(),
    get_costs(),
    get_health_analysis(),
    get_recommendations(),
  ]);
  return {
    message: `Analyzed ${inv.total} resource(s). Estimated monthly spend ${fmtUSD(costs.total)}, ${health.issues.length} issue(s), ${health.openAlerts} open alert(s).`,
    recommendations: recs,
    metadata: { inventory: inv, costs, health },
  };
}
