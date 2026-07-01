import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/dashboard/ai-assistant")({
  head: () => ({ meta: [{ title: "Cloud AI · CloudVision" }] }),
  component: AI,
});

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Why is CPU high on cache-asia-01?",
  "Which server is unhealthy right now?",
  "Predict failures in the next 24 hours",
  "Generate this week's cost report",
  "Explain the last critical alert",
];

const seed: Msg[] = [
  { role: "ai", text: "Hi Alex — I'm Cloud AI. I'm watching 142 pods across 12 regions right now. Ask me anything about your infrastructure." },
];

function AI() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, {
        role: "ai",
        text: `Based on the last 15 minutes of telemetry, ${text.toLowerCase().includes("cpu")
          ? "cache-asia-01 is running a redis backfill job that's pinning 4 vCPUs. I recommend increasing the instance class to r6i.xlarge or offloading the job to a background worker."
          : "I've analyzed live metrics and correlated recent events. No critical anomalies detected in the last hour, but eu-west-2 is trending toward a scale-up in ~6 minutes."}`,
      }]);
    }, 800);
  };

  return (
    <div>
      <PageHeader title="Cloud AI" subtitle="Your infrastructure copilot — powered by OpenAI" />
      <GlassCard className="flex h-[70vh] flex-col !p-0">
        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--gradient-vivid)]">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold">Cloud AI</div>
            <div className="text-[11px] text-muted-foreground">Online · GPT-powered</div>
          </div>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
              >
                {m.role === "ai" && (
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--gradient-vivid)]">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-[var(--gradient-primary)] text-white shadow-[0_10px_30px_-10px_var(--neon-blue)]"
                    : "glass"
                }`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="border-t border-white/5 p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)}
                className="glass rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/5 p-1.5 ring-1 ring-white/10 focus-within:ring-[color:var(--neon-cyan)]/40">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask Cloud AI…"
              className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none"
            />
            <button onClick={() => send(input)} className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--gradient-vivid)] text-white">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
