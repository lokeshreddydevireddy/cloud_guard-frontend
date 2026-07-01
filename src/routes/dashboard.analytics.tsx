import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from "recharts";
import { series } from "@/lib/mock";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/analytics")({
  head: () => ({ meta: [{ title: "Analytics · CloudVision AI" }] }),
  component: Analytics,
});

function Analytics() {
  const [range, setRange] = useState<"Weekly" | "Monthly" | "Yearly">("Monthly");
  const cost = series(12, 12000, 3000, 88).map((d, i) => ({ ...d, label: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], cost: d.value, forecast: d.value * 1.06 + 800 }));
  const usage = series(20, 60, 25, 91);
  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Reports, cost analysis, and forecasts"
        actions={
          <div className="glass flex rounded-full p-1">
            {(["Weekly","Monthly","Yearly"] as const).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${range === r ? "bg-[var(--gradient-vivid)] text-white" : "text-muted-foreground hover:text-foreground"}`}>
                {r}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Total cost", v: "$142,890" }, { l: "Projected", v: "$154,120" },
          { l: "Savings", v: "$18,412" }, { l: "Efficiency", v: "94.2%" },
        ].map((s, i) => (
          <GlassCard key={i} className="p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="font-display text-2xl font-bold">{s.v}</div>
          </GlassCard>
        ))}
      </div>
      <GlassCard className="mt-4">
        <div className="font-display text-lg font-semibold">Cost analysis & forecast</div>
        <div className="mt-3 h-80">
          <ResponsiveContainer>
            <AreaChart data={cost}>
              <defs>
                <linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient>
                <linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} /><stop offset="100%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="cost" stroke="#22d3ee" strokeWidth={2} fill="url(#c)" />
              <Area type="monotone" dataKey="forecast" stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 3" fill="url(#f)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
      <GlassCard className="mt-4">
        <div className="font-display text-lg font-semibold">Resource utilization</div>
        <div className="mt-3 h-64">
          <ResponsiveContainer>
            <LineChart data={usage}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
