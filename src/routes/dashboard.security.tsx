import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { Shield, ShieldAlert, Users, Ban } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/security")({
  head: () => ({ meta: [{ title: "Security · CloudVision AI" }] }),
  component: Security,
});

function Security() {
  return (
    <div>
      <PageHeader title="Security" subtitle="Posture, threats, and access hygiene" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1">
          <div className="text-xs text-muted-foreground">Security score</div>
          <div className="mt-2 flex items-end gap-3">
            <div className="font-display text-6xl font-bold text-gradient">98</div>
            <div className="pb-2 text-sm text-[color:var(--success)]">A+ · Excellent</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <motion.div initial={{ width: 0 }} animate={{ width: "98%" }} transition={{ duration: 1.2 }}
              className="h-full rounded-full bg-[var(--gradient-cyan)] shadow-[0_0_16px_var(--neon-cyan)]" />
          </div>
          <div className="mt-4 text-xs text-muted-foreground">Risk level: <span className="text-[color:var(--success)]">Low</span></div>
        </GlassCard>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          {[
            { icon: ShieldAlert, l: "Failed logins (24h)", v: "38" },
            { icon: Users, l: "Active users", v: "1,412" },
            { icon: Ban, l: "Blocked IPs", v: "217" },
            { icon: Shield, l: "Firewall", v: "Active" },
          ].map((s, i) => (
            <GlassCard key={i} className="p-5">
              <s.icon className="h-5 w-5 text-[color:var(--neon-cyan)]" />
              <div className="mt-2 text-xs text-muted-foreground">{s.l}</div>
              <div className="font-display text-2xl font-bold">{s.v}</div>
            </GlassCard>
          ))}
        </div>
      </div>

      <GlassCard className="mt-4">
        <div className="font-display text-lg font-semibold">Suspicious activity</div>
        <div className="mt-3 divide-y divide-white/5">
          {[
            { ip: "185.220.101.42", country: "🇩🇪 DE", event: "Brute-force attempt · SSH", risk: "high" },
            { ip: "94.130.11.98", country: "🇩🇪 DE", event: "Unusual API rate", risk: "medium" },
            { ip: "51.15.62.10", country: "🇫🇷 FR", event: "Geo anomaly", risk: "low" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-mono">{r.ip} <span className="ml-2 text-xs text-muted-foreground">{r.country}</span></div>
                <div className="text-xs text-muted-foreground">{r.event}</div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                r.risk === "high" ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]" :
                r.risk === "medium" ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" :
                "bg-white/5 text-muted-foreground"
              }`}>{r.risk.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
