import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  title, subtitle, actions,
}: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </motion.div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatusPill({ level }: { level: string }) {
  const map: Record<string, string> = {
    healthy: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    running: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    active: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    available: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    deployed: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    compliant: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
    warning: "bg-[color:var(--warning)]/15 text-[color:var(--warning)]",
    scaling: "bg-[color:var(--neon-blue)]/15 text-[color:var(--neon-blue)]",
    critical: "bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
    stopped: "bg-white/5 text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${map[level] || "bg-white/5"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {level}
    </span>
  );
}
