import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { Download, Search, Filter, ScrollText } from "lucide-react";
import { useState } from "react";
import { useLogs } from "@/lib/queries";
import { extractError } from "@/lib/api";
import { EmptyView, ErrorView, LoadingScreen } from "@/components/StateViews";

export const Route = createFileRoute("/dashboard/logs")({
  head: () => ({ meta: [{ title: "Logs · CloudVision AI" }] }),
  component: Logs,
});

function Logs() {
  const [q, setQ] = useState("");
  const { data, isLoading, error, refetch } = useLogs({ q, limit: 200 });

  return (
    <div>
      <PageHeader
        title="Logs"
        subtitle="Search, filter, and export across the entire fleet"
        actions={
          <>
            <button className="glass rounded-full px-3 py-1.5 text-xs font-medium hover:bg-white/10"><Download className="mr-1 inline h-3 w-3" /> CSV</button>
            <button className="rounded-full bg-[var(--gradient-vivid)] px-3 py-1.5 text-xs font-semibold text-white"><Download className="mr-1 inline h-3 w-3" /> PDF</button>
          </>
        }
      />
      <GlassCard>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search logs…" className="w-full bg-transparent text-sm focus:outline-none" />
          </div>
          <button className="glass flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs"><Filter className="h-3 w-3" /> Filter</button>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl bg-black/30 ring-1 ring-white/5">
          {isLoading ? (
            <LoadingScreen label="Fetching logs…" />
          ) : error ? (
            <ErrorView message={extractError(error)} onRetry={() => refetch()} />
          ) : !data?.length ? (
            <EmptyView title="No logs match" description="Try widening your search or check back once your fleet emits events." icon={<ScrollText className="h-5 w-5" />} />
          ) : (
            <table className="w-full text-left font-mono text-[12px]">
              <tbody>
                {data.map((l) => (
                  <tr key={l._id} className="border-t border-white/5 first:border-t-0 hover:bg-white/[0.03]">
                    <td className="w-24 px-4 py-2 text-muted-foreground">{new Date(l.timestamp).toISOString().slice(11, 19)}</td>
                    <td className="w-16 px-2 py-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        l.level === "ERROR" ? "bg-[color:var(--danger)]/20 text-[color:var(--danger)]" :
                        l.level === "WARN" ? "bg-[color:var(--warning)]/20 text-[color:var(--warning)]" :
                        l.level === "INFO" ? "bg-[color:var(--neon-cyan)]/15 text-[color:var(--neon-cyan)]" :
                        "bg-white/5 text-muted-foreground"
                      }`}>{l.level}</span>
                    </td>
                    <td className="w-24 px-2 py-2 text-[color:var(--neon-purple)]">{l.service ?? "-"}</td>
                    <td className="px-2 py-2 text-foreground/85">{l.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
