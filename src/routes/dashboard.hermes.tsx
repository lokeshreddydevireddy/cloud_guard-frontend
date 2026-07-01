import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { Send, Bot, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHermesAnalyze, useHermesChat, useHermesClear, useHermesHistory, type HermesHistoryItem } from "@/lib/hermes";
import { HAS_BACKEND, extractError } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/hermes")({
  head: () => ({ meta: [{ title: "Hermes Copilot · CloudVision" }] }),
  component: HermesPage,
});

const suggestions = [
  "Why is my cloud bill high?",
  "How many EC2 instances are running?",
  "List all my services",
  "How can I reduce costs?",
  "Any issues in my account?",
];

interface LocalMsg {
  role: "user" | "assistant";
  message: string;
  recommendations?: string[];
}

function HermesPage() {
  const history = useHermesHistory();
  const chat = useHermesChat();
  const analyze = useHermesAnalyze();
  const clear = useHermesClear();
  const [input, setInput] = useState("");
  const [local, setLocal] = useState<LocalMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages: LocalMsg[] = useMemo(() => {
    if (!HAS_BACKEND) return local;
    const server = (history.data ?? []).map((h: HermesHistoryItem) => ({
      role: h.role === "assistant" ? "assistant" : "user",
      message: h.message,
      recommendations: (h.metadata?.recommendations as string[]) ?? [],
    })) as LocalMsg[];
    return [...server, ...local];
  }, [history.data, local]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, chat.isPending]);

  async function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setInput("");
    if (!HAS_BACKEND) {
      setLocal((m) => [
        ...m,
        { role: "user", message: value },
        { role: "assistant", message: "Hermes runs against the backend. Set VITE_API_URL to enable live responses." },
      ]);
      return;
    }
    setLocal((m) => [...m, { role: "user", message: value }]);
    try {
      const res = await chat.mutateAsync(value);
      setLocal((m) => m.filter((x) => x.message !== value || x.role !== "user"));
      // history refetch will render both messages
      void res;
    } catch (e) {
      toast.error(extractError(e, "Hermes failed to respond"));
    }
  }

  async function runAnalyze() {
    if (!HAS_BACKEND) return;
    try {
      await analyze.mutateAsync();
    } catch (e) {
      toast.error(extractError(e, "Analyze failed"));
    }
  }

  async function clearAll() {
    if (!HAS_BACKEND) return setLocal([]);
    try {
      await clear.mutateAsync();
      setLocal([]);
      toast.success("History cleared");
    } catch (e) {
      toast.error(extractError(e, "Failed to clear"));
    }
  }

  const empty = messages.length === 0;

  return (
    <div>
      <PageHeader
        title="Hermes Copilot"
        subtitle="Ask Hermes about cost, inventory, health, logs, and optimizations"
        actions={
          <div className="flex gap-2">
            <button
              onClick={runAnalyze}
              disabled={analyze.isPending || !HAS_BACKEND}
              className="glass rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-white/10 disabled:opacity-50"
            >
              {analyze.isPending ? "Analyzing…" : "Run full analysis"}
            </button>
            <button
              onClick={clearAll}
              className="glass rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Clear
            </button>
          </div>
        }
      />

      <GlassCard className="flex h-[70vh] flex-col !p-0">
        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-vivid)]">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold">Hermes</div>
            <div className="text-[11px] text-muted-foreground">Read-only cloud copilot · Phase 1</div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
          {empty && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--gradient-vivid)]">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="font-display text-lg font-semibold">Meet Hermes</div>
                <div className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Your cloud copilot for spend, inventory, health and optimization insights.
                </div>
              </div>
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "assistant" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--gradient-vivid)]">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-[var(--gradient-primary)] text-white shadow-[0_10px_30px_-10px_var(--neon-blue)]"
                      : "glass"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.message}</div>
                  {m.recommendations && m.recommendations.length > 0 && (
                    <ul className="mt-2 space-y-1 border-t border-white/10 pt-2 text-xs text-muted-foreground">
                      {m.recommendations.map((r, k) => (
                        <li key={k}>• {r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {chat.isPending && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Hermes is thinking…
            </div>
          )}
        </div>

        <div className="border-t border-white/5 p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="glass rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 p-1.5 ring-1 ring-white/10 focus-within:ring-[color:var(--neon-cyan)]/40">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask Hermes about your cloud…"
              className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={() => send(input)}
              disabled={chat.isPending}
              className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--gradient-vivid)] text-white disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
