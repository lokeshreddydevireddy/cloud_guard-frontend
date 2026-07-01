import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader, StatusPill } from "@/components/PageHeader";
import { useServers, useDeleteServer, type ServerRecord } from "@/lib/queries";
import { useAuthStore, hasPermission } from "@/stores/auth";
import { extractError } from "@/lib/api";
import { Cpu, MemoryStick, HardDrive, Thermometer, Power, RotateCw, Terminal, ScrollText, MapPin, Globe, Trash2, Server as ServerIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EmptyView, ErrorView, SkeletonCard } from "@/components/StateViews";

export const Route = createFileRoute("/dashboard/servers")({
  head: () => ({ meta: [{ title: "Servers · CloudVision AI" }] }),
  component: Servers,
});

function Bar({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label} <span className="ml-auto font-mono text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, color-mix(in oklab, ${color} 40%, transparent))`, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
    </div>
  );
}

function ServerCard({ s }: { s: ServerRecord }) {
  const user = useAuthStore((state) => state.user);
  const del = useDeleteServer();
  const canWrite = hasPermission(user?.role, "servers:write");

  async function handleDelete() {
    if (!confirm(`Delete ${s.name}?`)) return;
    try {
      await del.mutateAsync(s._id);
      toast.success("Server removed");
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <div>
          <div className="font-display text-lg font-semibold">{s.name}</div>
          <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {s.operatingSystem}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.region}</span>
          </div>
        </div>
        <StatusPill level={s.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-white/[0.03] p-3 font-mono text-[11px] text-muted-foreground">
        <div><span className="opacity-60">IP</span> {s.ip}</div>
        <div><span className="opacity-60">HOST</span> {s.hostname}</div>
      </div>
      <div className="mt-4 space-y-3">
        <Bar label="CPU" value={s.cpu} icon={Cpu} color="#22d3ee" />
        <Bar label="RAM" value={s.ram} icon={MemoryStick} color="#a78bfa" />
        <Bar label="Disk" value={s.disk} icon={HardDrive} color="#60a5fa" />
        {s.temp != null && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Thermometer className="h-3 w-3" /> {s.temp}°C
          </div>
        )}
      </div>
      <div className="mt-5 grid grid-cols-4 gap-1.5">
        {[
          { Icon: RotateCw, label: "Restart", requireWrite: true },
          { Icon: Power, label: "Stop", requireWrite: true },
          { Icon: Terminal, label: "SSH", requireWrite: true },
          { Icon: ScrollText, label: "Logs", requireWrite: false },
        ].map(({ Icon, label, requireWrite }) => (
          <button key={label}
            disabled={requireWrite && !canWrite}
            className="glass flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium text-muted-foreground transition-all hover:text-foreground hover:shadow-[0_0_20px_-5px_var(--neon-cyan)] disabled:opacity-40">
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>
      {canWrite && (
        <button onClick={handleDelete}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[color:var(--danger)]/10 py-1.5 text-[11px] font-medium text-[color:var(--danger)] ring-1 ring-[color:var(--danger)]/20 hover:bg-[color:var(--danger)]/15">
          <Trash2 className="h-3 w-3" /> Remove
        </button>
      )}
    </GlassCard>
  );
}

function Servers() {
  const { data, isLoading, error, refetch } = useServers();

  return (
    <div>
      <PageHeader title="Servers" subtitle="Fleet-wide compute across regions" />
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <ErrorView message={extractError(error)} onRetry={() => refetch()} />
      ) : !data?.length ? (
        <EmptyView icon={<ServerIcon className="h-5 w-5" />}
          title="No servers yet"
          description="Provision your first server or connect a fleet via the API." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((s) => <ServerCard key={s._id} s={s} />)}
        </div>
      )}
    </div>
  );
}
