import { createFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { useAlerts } from "@/lib/queries";
import { extractError } from "@/lib/api";
import { Bell, Mail, Slack, Smartphone, AlertTriangle } from "lucide-react";
import { EmptyView, ErrorView, SkeletonCard } from "@/components/StateViews";

export const Route = createFileRoute("/dashboard/alerts")({
  head: () => ({ meta: [{ title: "Alerts · CloudVision AI" }] }),
  component: Alerts,
});

const rules = [
  "CPU above 90%", "RAM above 90%", "Disk Full", "Server Down",
  "Database Offline", "High Network Usage",
];

function Alerts() {
  const { data, isLoading, error, refetch } = useAlerts();

  return (
    <div>
      <PageHeader title="Alerts" subtitle="Predictive rules and live incidents" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="font-display text-lg font-semibold">Active</div>
          <div className="mt-3">
            {isLoading ? (
              <div className="space-y-2"><SkeletonCard /><SkeletonCard /></div>
            ) : error ? (
              <ErrorView message={extractError(error)} onRetry={() => refetch()} />
            ) : !data?.length ? (
              <EmptyView title="No active alerts" description="All systems nominal." icon={<AlertTriangle className="h-5 w-5" />} />
            ) : (
              <div className="divide-y divide-white/5">
                {data.map((a) => (
                  <div key={a._id} className="flex items-center gap-3 py-3">
                    <div className={`grid h-9 w-9 place-items-center rounded-lg ${
                      a.severity === "critical" ? "bg-[color:var(--danger)]/15 text-[color:var(--danger)]" :
                      a.severity === "warning" ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]" :
                      "bg-[color:var(--neon-blue)]/15 text-[color:var(--neon-blue)]"
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
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
          </div>
        </GlassCard>
        <div className="space-y-4">
          <GlassCard>
            <div className="font-display text-lg font-semibold">Rules</div>
            <div className="mt-3 space-y-1.5">
              {rules.map(r => (
                <div key={r} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
                  <span>{r}</span>
                  <span className="h-2 w-2 rounded-full bg-[color:var(--success)] shadow-[0_0_8px_var(--success)]" />
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <div className="font-display text-lg font-semibold">Notification channels</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { Icon: Mail, l: "Email" }, { Icon: Bell, l: "Push" }, { Icon: Slack, l: "Slack" },
                { Icon: Smartphone, l: "SMS" },
              ].map(({ Icon, l }) => (
                <button key={l} className="glass flex flex-col items-center gap-1 rounded-xl py-3 text-[11px] hover:text-foreground">
                  <Icon className="h-4 w-4 text-[color:var(--neon-cyan)]" /> {l}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
