import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader, StatusPill } from "@/components/PageHeader";
import { awsResources } from "@/lib/mock";
import { Cloud, Filter, Download } from "lucide-react";

export const Route = createFileRoute("/dashboard/infrastructure")({
  head: () => ({ meta: [{ title: "Infrastructure · CloudVision AI" }] }),
  component: Infra,
});

function Infra() {
  return (
    <div>
      <PageHeader
        title="Infrastructure"
        subtitle="Live view across AWS · Azure · GCP · on-prem"
        actions={
          <>
            <button className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-white/10"><Filter className="h-3 w-3" /> Filter</button>
            <button className="rounded-full bg-[var(--gradient-vivid)] px-3 py-1.5 text-xs font-semibold text-white"><Download className="mr-1 inline h-3 w-3" /> Export</button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total resources", value: "1,284", tone: "cyan" },
          { label: "Regions", value: "12", tone: "blue" },
          { label: "Monthly cost", value: "$18,412", tone: "purple" },
          { label: "Cost anomalies", value: "3", tone: "pink" },
        ].map((s, i) => (
          <GlassCard key={i} className="p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-4 overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                {["Kind", "Name", "Region", "Status", "Usage"].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {awsResources.map((r, i) => (
                <tr key={i} className="border-t border-white/5 transition-colors hover:bg-white/[0.03]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-md bg-white/5 text-[color:var(--neon-cyan)]"><Cloud className="h-3.5 w-3.5" /></div>
                      <span className="font-medium">{r.kind}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">{r.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.region}</td>
                  <td className="px-5 py-3"><StatusPill level={r.status} /></td>
                  <td className="px-5 py-3 text-muted-foreground">{r.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
