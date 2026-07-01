import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader, StatusPill } from "@/components/PageHeader";
import { containers } from "@/lib/mock";
import { Container as ContainerIcon, RotateCw, Trash2, Rocket, ScrollText } from "lucide-react";

export const Route = createFileRoute("/dashboard/docker")({
  head: () => ({ meta: [{ title: "Docker · CloudVision AI" }] }),
  component: Docker,
});

function Docker() {
  const running = containers.filter(c => c.status === "running").length;
  const stopped = containers.length - running;
  return (
    <div>
      <PageHeader
        title="Docker"
        subtitle={`${running} running · ${stopped} stopped`}
        actions={<button className="rounded-full bg-[var(--gradient-vivid)] px-3 py-1.5 text-xs font-semibold text-white"><Rocket className="mr-1 inline h-3 w-3" /> Deploy</button>}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {containers.map(c => (
          <GlassCard key={c.id}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--neon-blue)]/15 text-[color:var(--neon-blue)]">
                  <ContainerIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-semibold">{c.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{c.image}</div>
                </div>
              </div>
              <StatusPill level={c.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-white/[0.03] p-3 text-xs">
              <div><div className="text-[10px] uppercase text-muted-foreground">CPU</div><div className="font-mono">{c.cpu}%</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">RAM</div><div className="font-mono">{c.ram} MB</div></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {[
                { Icon: RotateCw, label: "Restart" },
                { Icon: ScrollText, label: "Logs" },
                { Icon: Trash2, label: "Delete" },
              ].map(({ Icon, label }) => (
                <button key={label} className="glass flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] hover:text-foreground">
                  <Icon className="h-3 w-3" /> {label}
                </button>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
