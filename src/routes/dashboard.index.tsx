import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Cpu, MemoryStick, HardDrive, Gauge, Wifi, Timer, Thermometer, Battery,
  Activity, Container, Boxes, AlertTriangle, TrendingUp, TrendingDown, ArrowUpRight,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, LineChart, Line, BarChart, Bar,
  RadialBarChart, RadialBar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
} from "recharts";
import { series } from "@/lib/mock";
import { GlassCard } from "@/components/GlassCard";
import { useAlerts } from "@/lib/queries";
import { useAuthStore } from "@/stores/auth";
import { formatDistanceToNow } from "date-fns";
import { EmptyView } from "@/components/StateViews";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Overview · CloudVision AI" }] }),
  component: Overview,
});

const stats = [
  { label: "CPU Usage", value: "42%", delta: "+2.1%", up: true, icon: Cpu, color: "cyan", data: series(24, 42, 20, 1) },
  { label: "RAM Usage", value: "61%", delta: "-0.8%", up: false, icon: MemoryStick, color: "purple", data: series(24, 61, 12, 2) },
  { label: "Disk Usage", value: "38%", delta: "+1.4%", up: true, icon: HardDrive, color: "blue", data: series(24, 38, 8, 3) },
  { label: "GPU Usage", value: "77%", delta: "+5.6%", up: true, icon: Gauge, color: "pink", data: series(24, 77, 18, 4) },
  { label: "Network I/O", value: "1.24 GB/s", delta: "+12%", up: true, icon: Wifi, color: "cyan", data: series(24, 60, 24, 5) },
  { label: "Internet Speed", value: "942 Mbps", delta: "+0.4%", up: true, icon: ArrowUpRight, color: "blue", data: series(24, 82, 8, 6) },
  { label: "System Uptime", value: "142d 6h", delta: "99.99%", up: true, icon: Timer, color: "purple", data: series(24, 90, 4, 7) },
  { label: "Temperature", value: "58°C", delta: "Nominal", up: true, icon: Thermometer, color: "pink", data: series(24, 58, 8, 8) },
  { label: "Battery", value: "94%", delta: "AC", up: true, icon: Battery, color: "cyan", data: series(24, 94, 2, 9) },
  { label: "Processes", value: "312", delta: "+4", up: true, icon: Activity, color: "purple", data: series(24, 40, 6, 10) },
  { label: "Docker", value: "18", delta: "5 running", up: true, icon: Container, color: "blue", data: series(24, 30, 4, 11) },
  { label: "K8s Pods", value: "142", delta: "healthy", up: true, icon: Boxes, color: "pink", data: series(24, 70, 6, 12) },
];

const colorMap: Record<string, { grad: string; stroke: string }> = {
  cyan: { grad: "var(--neon-cyan)", stroke: "#22d3ee" },
  blue: { grad: "var(--neon-blue)", stroke: "#60a5fa" },
  purple: { grad: "var(--neon-purple)", stroke: "#a78bfa" },
  pink: { grad: "var(--neon-pink)", stroke: "#ec4899" },
};

function StatCard({ s, i }: { s: (typeof stats)[number]; i: number }) {
  const c = colorMap[s.color];
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.4 }}
      className="glass group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(96,165,250,0.35)]"
    >
      <div className="flex items-start justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10" style={{ color: c.stroke }}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
          s.up ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
        }`}>
          {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {s.delta}
        </span>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">{s.label}</div>
      <div className="font-display text-2xl font-bold tracking-tight">{s.value}</div>
      <div className="mt-2 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={s.data}>
            <defs>
              <linearGradient id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.stroke} stopOpacity={0.55} />
                <stop offset="100%" stopColor={c.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={c.stroke} strokeWidth={1.5} fill={`url(#g${i})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

const traffic = series(30, 500, 250, 42).map((d, i) => ({
  ...d, upload: 200 + Math.abs(Math.sin(i/3))*180 + (i%5)*10, download: d.value,
}));
const requests = series(30, 1200, 400, 21).map(d => ({ ...d, rps: d.value }));
const pieData = [
  { name: "Compute", value: 42, color: "#22d3ee" },
  { name: "Storage", value: 18, color: "#60a5fa" },
  { name: "Network", value: 22, color: "#a78bfa" },
  { name: "AI/ML", value: 18, color: "#ec4899" },
];
const health = [
  { name: "API", value: 98, fill: "#22d3ee" },
  { name: "DB", value: 92, fill: "#60a5fa" },
  { name: "Cache", value: 74, fill: "#a78bfa" },
  { name: "Queue", value: 88, fill: "#ec4899" },
];

function Overview() {
  const user = useAuthStore((s) => s.user);
  const firstName = (user?.name ?? "there").split(" ")[0];
  const { data: alerts = [] } = useAlerts();
  const warnings = alerts.filter((a) => a.severity === "warning").length;

  return (
    <div className="space-y-6">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl font-bold tracking-tight md:text-3xl"
        >
          Welcome back, {firstName}.
        </motion.h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {alerts.length === 0
            ? "All systems nominal. No active alerts."
            : <>{alerts.length} active alerts · <span className="text-[color:var(--warning)]">{warnings} warnings</span></>}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {stats.map((s, i) => <StatCard key={s.label} s={s} i={i} />)}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Real-time throughput</div>
              <div className="font-display text-lg font-semibold">Network upload / download</div>
            </div>
            <div className="flex gap-2 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#22d3ee]" /> Upload</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#a78bfa]" /> Download</span>
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <AreaChart data={traffic}>
                <defs>
                  <linearGradient id="up" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="down" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.5} /><stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="upload" stroke="#22d3ee" strokeWidth={2} fill="url(#up)" />
                <Area type="monotone" dataKey="download" stroke="#a78bfa" strokeWidth={2} fill="url(#down)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs text-muted-foreground">Resource distribution</div>
          <div className="font-display text-lg font-semibold">Traffic analytics</div>
          <div className="mt-2 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            {pieData.map(p => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                <span className="text-muted-foreground">{p.name}</span>
                <span className="ml-auto font-mono">{p.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard>
          <div className="text-xs text-muted-foreground">Requests per second</div>
          <div className="font-display text-lg font-semibold">18,412 <span className="text-xs text-[color:var(--success)]">▲ 6.2%</span></div>
          <div className="mt-3 h-40">
            <ResponsiveContainer>
              <LineChart data={requests}>
                <Line type="monotone" dataKey="rps" stroke="#60a5fa" strokeWidth={2} dot={false} />
                <XAxis hide dataKey="label" /><YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs text-muted-foreground">Response time (p95)</div>
          <div className="font-display text-lg font-semibold">128ms <span className="text-xs text-[color:var(--success)]">▼ 4ms</span></div>
          <div className="mt-3 h-40">
            <ResponsiveContainer>
              <BarChart data={series(14, 120, 40, 55)}>
                <Bar dataKey="value" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                <XAxis hide dataKey="label" /><YAxis hide />
                <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="text-xs text-muted-foreground">Server health</div>
          <div className="font-display text-lg font-semibold">All systems nominal</div>
          <div className="mt-3 h-40">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={health} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" background={{ fill: "rgba(255,255,255,0.06)" }} cornerRadius={8} />
                <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Recent activity</div>
            <div className="font-display text-lg font-semibold">Active alerts</div>
          </div>
          <button className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium ring-1 ring-white/10 hover:bg-white/10">
            View all
          </button>
        </div>
        {alerts.length === 0 ? (
          <EmptyView title="No active alerts" description="Your fleet is healthy." />
        ) : (
          <div className="divide-y divide-white/5">
            {alerts.slice(0, 5).map((a) => (
              <div key={a._id} className="flex items-center gap-3 py-3">
                <div className={`grid h-8 w-8 place-items-center rounded-lg ${
                  a.severity === "critical" ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]" :
                  a.severity === "warning" ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" :
                  "bg-[color:var(--neon-blue)]/15 text-[color:var(--neon-blue)]"
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{a.severity}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
