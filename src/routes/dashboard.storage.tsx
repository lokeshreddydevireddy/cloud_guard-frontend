import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/dashboard/storage")({
  head: () => ({ meta: [{ title: "Storage · CloudVision AI" }] }),
  component: Storage,
});

const usage = [
  { name: "Used", value: 612, color: "#a78bfa" },
  { name: "Free", value: 388, color: "rgba(255,255,255,0.08)" },
];
const kinds = [
  { name: "Object", v: 412 }, { name: "Block", v: 168 }, { name: "DB", v: 88 }, { name: "Backup", v: 42 },
];

function Storage() {
  return (
    <div>
      <PageHeader title="Storage" subtitle="Object, block, and database storage across regions" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard>
          <div className="text-xs text-muted-foreground">Total capacity</div>
          <div className="font-display text-2xl font-bold">1.0 PB</div>
          <div className="mt-3 h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={usage} innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {usage.map(u => <Cell key={u.name} fill={u.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-muted-foreground">612 TB used · 388 TB free</div>
        </GlassCard>
        <GlassCard className="lg:col-span-2">
          <div className="font-display text-lg font-semibold">Storage by kind</div>
          <div className="mt-3 h-64">
            <ResponsiveContainer>
              <BarChart data={kinds}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} />
                <Tooltip contentStyle={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="v" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Files", v: "8.4M" }, { l: "Buckets", v: "142" },
          { l: "Databases", v: "24" }, { l: "Snapshots", v: "1,204" },
        ].map((s, i) => (
          <GlassCard key={i} className="p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="font-display text-2xl font-bold">{s.v}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
