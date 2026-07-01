import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader, StatusPill } from "@/components/PageHeader";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { series } from "@/lib/mock";

export const Route = createFileRoute("/dashboard/networking")({
  head: () => ({ meta: [{ title: "Networking · CloudVision AI" }] }),
  component: Networking,
});

function Networking() {
  const data = series(30, 480, 200, 33);
  return (
    <div>
      <PageHeader title="Networking" subtitle="Bandwidth, latency and edge traffic" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Bandwidth", v: "1.24 GB/s" }, { l: "Latency", v: "42 ms" },
          { l: "Packet loss", v: "0.02%" }, { l: "Firewall", v: "Active" },
        ].map((s, i) => (
          <GlassCard key={i} className="p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="font-display text-2xl font-bold">{s.v}</div>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="mt-4">
        <div className="font-display text-lg font-semibold">Traffic map</div>
        <div className="mt-3 h-72">
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="net" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} fill="url(#net)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <GlassCard>
          <div className="font-display text-lg font-semibold">Open ports</div>
          <div className="mt-3 divide-y divide-white/5 font-mono text-sm">
            {[
              { port: 22, svc: "SSH", state: "healthy" },
              { port: 80, svc: "HTTP", state: "healthy" },
              { port: 443, svc: "HTTPS", state: "healthy" },
              { port: 5432, svc: "PostgreSQL", state: "warning" },
              { port: 6379, svc: "Redis", state: "healthy" },
            ].map(p => (
              <div key={p.port} className="flex items-center justify-between py-2.5">
                <span>:{p.port} <span className="ml-2 text-muted-foreground">{p.svc}</span></span>
                <StatusPill level={p.state} />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="font-display text-lg font-semibold">Connected devices</div>
          <div className="mt-3 space-y-2 text-sm">
            {["MacBook Pro · alex", "iPhone 17 · alex", "Deploy Bot · CI", "Grafana Cloud", "PagerDuty"].map(d => (
              <div key={d} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                <span>{d}</span>
                <span className="h-2 w-2 rounded-full bg-[color:var(--success)] shadow-[0_0_8px_var(--success)]" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
