import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import {
  ArrowRight, Play, Sparkles, Zap, Shield, Activity, Cloud, Cpu, Globe as GlobeIcon,
  Check, ChevronDown, Github, Twitter, Linkedin,
} from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";

const Globe3D = lazy(() => import("@/components/Globe3D").then((m) => ({ default: m.Globe3D })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CloudVision AI — AI-native cloud monitoring" },
      { name: "description", content: "Enterprise-grade AI cloud monitoring for servers, containers, Kubernetes and multi-cloud infrastructure. Real-time insights, predictive alerts, and Cloud AI." },
      { property: "og:title", content: "CloudVision AI — AI-native cloud monitoring" },
      { property: "og:description", content: "Real-time insights, predictive alerts, and an AI copilot for your entire cloud." },
    ],
  }),
  component: Landing,
});

function TypingText() {
  const words = ["infrastructure.", "containers.", "Kubernetes.", "multi-cloud.", "everything."];
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i];
    const t = setTimeout(() => {
      if (!del) {
        setTxt(w.slice(0, txt.length + 1));
        if (txt.length + 1 === w.length) setTimeout(() => setDel(true), 1400);
      } else {
        setTxt(w.slice(0, txt.length - 1));
        if (txt.length - 1 === 0) { setDel(false); setI((i + 1) % words.length); }
      }
    }, del ? 40 : 85);
    return () => clearTimeout(t);
  }, [txt, del, i]);
  return (
    <span className="text-gradient">
      {txt}
      <span className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-1 animate-pulse bg-[color:var(--neon-cyan)]" />
    </span>
  );
}

function FloatingCard({ x, y, delay, children }: { x: string; y: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className="pointer-events-none absolute hidden md:block"
      style={{ left: x, top: y }}
    >
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut" }}>
        <div className="glass rounded-2xl px-4 py-3 shadow-[0_20px_60px_-20px_rgba(96,165,250,0.4)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Nav() {
  return (
    <nav className="glass fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1.5">
      <Link to="/" className="flex items-center gap-2 rounded-full px-3 py-1.5">
        <div className="grid h-6 w-6 place-items-center rounded-md bg-[var(--gradient-vivid)]">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-display text-sm font-semibold">CloudVision</span>
      </Link>
      <div className="mx-2 hidden gap-1 md:flex">
        {["Features", "Pricing", "Docs", "Changelog"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            {l}
          </a>
        ))}
      </div>
      <Link
        to="/dashboard"
        className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
      >
        Sign in
      </Link>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      <ParticleBackground density={70} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, color-mix(in oklab, var(--neon-purple) 30%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
          >
            <Sparkles className="h-3 w-3 text-[color:var(--neon-cyan)]" />
            <span className="text-muted-foreground">Introducing Cloud AI — your infrastructure copilot</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"
          >
            Total visibility for<br />your <TypingText />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            CloudVision AI unifies real-time monitoring, predictive alerts, and an
            AI copilot across servers, containers, Kubernetes and every major cloud —
            in one beautifully fast dashboard.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/dashboard"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--gradient-vivid)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_var(--neon-blue)] transition-transform hover:scale-[1.02]"
            >
              <span>Get started</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur hover:bg-white/10"
            >
              <Play className="h-3.5 w-3.5" /> View dashboard
            </Link>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[color:var(--success)]" /> SOC 2 ready</span>
            <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[color:var(--success)]" /> 99.99% uptime</span>
            <span className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[color:var(--success)]" /> Trusted by 4,200+ teams</span>
          </div>
        </div>

        <div className="relative h-[440px] md:h-[560px]">
          <Suspense fallback={<div className="h-full w-full animate-pulse rounded-full bg-white/5" />}>
            <Globe3D />
          </Suspense>
          <FloatingCard x="-6%" y="14%" delay={0.6}>
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--neon-cyan)]/15 text-[color:var(--neon-cyan)]">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">CPU · us-east-1</div>
                <div className="font-display text-sm font-semibold">42% <span className="ml-1 text-[color:var(--success)] text-[10px]">▲ stable</span></div>
              </div>
            </div>
          </FloatingCard>
          <FloatingCard x="70%" y="8%" delay={0.9}>
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--neon-purple)]/15 text-[color:var(--neon-purple)]">
                <Cloud className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">142 pods</div>
                <div className="font-display text-sm font-semibold">Healthy</div>
              </div>
            </div>
          </FloatingCard>
          <FloatingCard x="72%" y="66%" delay={1.1}>
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--neon-blue)]/15 text-[color:var(--neon-blue)]">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Predicted</div>
                <div className="font-display text-sm font-semibold">Scale +2 in 6m</div>
              </div>
            </div>
          </FloatingCard>
          <FloatingCard x="-4%" y="70%" delay={1.3}>
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[color:var(--neon-pink)]/15 text-[color:var(--neon-pink)]">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-muted-foreground">Security score</div>
                <div className="font-display text-sm font-semibold">A+ · 98/100</div>
              </div>
            </div>
          </FloatingCard>
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Activity, title: "Real-time metrics", desc: "Sub-second telemetry for CPU, RAM, disk, GPU, network across every host and cluster." },
  { icon: Sparkles, title: "Cloud AI copilot", desc: "Ask why CPU is high, predict failures, and generate reports in natural language." },
  { icon: Cloud, title: "Multi-cloud native", desc: "AWS, Azure, GCP, Docker & Kubernetes — one unified control plane." },
  { icon: Shield, title: "Security posture", desc: "Continuous scanning, blocked IPs, failed logins and a live risk score." },
  { icon: GlobeIcon, title: "Global edge", desc: "Deployed across 34 regions with latency-aware routing and traffic maps." },
  { icon: Zap, title: "Predictive alerts", desc: "ML anomaly detection catches incidents before they reach your users." },
];

function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--neon-cyan)]">Platform</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Every signal, one surface.</h2>
          <p className="mt-4 text-muted-foreground">
            Built for engineers who care about milliseconds — and CFOs who care about margins.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass group relative overflow-hidden rounded-2xl p-6"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, color-mix(in oklab, var(--neon-cyan) 60%, transparent), color-mix(in oklab, var(--neon-purple) 60%, transparent))",
                  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  WebkitMaskComposite: "xor", maskComposite: "exclude", padding: 1,
                }}
              />
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-[var(--gradient-primary)] shadow-[0_10px_30px_-10px_var(--neon-blue)]">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  { name: "Starter", price: "$0", desc: "For hobbyists exploring monitoring.", features: ["5 hosts", "24h retention", "Community support", "Basic alerts"] },
  { name: "Growth", price: "$49", featured: true, desc: "For fast-moving teams shipping daily.", features: ["100 hosts", "30-day retention", "Cloud AI copilot", "Slack, PagerDuty", "Predictive alerts"] },
  { name: "Enterprise", price: "Custom", desc: "For regulated, mission-critical fleets.", features: ["Unlimited hosts", "1-year retention", "SSO / SAML / SCIM", "Dedicated SRE", "Air-gapped option"] },
];

function Pricing() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--neon-cyan)]">Pricing</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Pay for signals, not seats.</h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass relative rounded-3xl p-7 ${p.featured ? "ring-1 ring-[color:var(--neon-cyan)]/40 shadow-[0_30px_80px_-20px_var(--neon-blue)]" : ""}`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--gradient-vivid)] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                  Most popular
                </div>
              )}
              <div className="font-display text-sm font-semibold text-muted-foreground">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                {p.price !== "Custom" && <span className="text-sm text-muted-foreground">/mo</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--success)]" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                className={`mt-7 flex w-full items-center justify-center gap-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  p.featured
                    ? "bg-[var(--gradient-vivid)] text-white hover:opacity-90"
                    : "bg-white/5 text-foreground ring-1 ring-white/10 hover:bg-white/10"
                }`}
              >
                Start free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { name: "Priya Sharma", role: "Head of SRE, Northwind", quote: "We replaced three tools with CloudVision. On-call is finally quiet." },
  { name: "Jordan Reyes", role: "CTO, Lumen Labs", quote: "The AI copilot explains incidents better than half my postmortems." },
  { name: "Aiko Tanaka", role: "Platform Lead, Bandolier", quote: "The dashboard alone is worth it. It just… feels premium." },
];

function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--neon-cyan)]">Loved by teams</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">The new standard for cloud ops.</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <p className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] text-xs font-semibold text-white">
                  {t.name.split(" ").map(s=>s[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "How is CloudVision different from Datadog or Grafana?", a: "CloudVision is opinionated, AI-native, and 10x faster to set up. One binary, one dashboard, one copilot — no plugin sprawl." },
  { q: "Do you support self-hosted deployments?", a: "Enterprise plans include an air-gapped self-hosted mode with Helm charts and Terraform modules." },
  { q: "Which clouds are supported?", a: "AWS is first-class today; Azure Monitor, Google Cloud Monitoring, Prometheus and Grafana are on the roadmap." },
  { q: "How does the AI copilot work?", a: "Cloud AI ingests live metrics, logs and events, then explains incidents, predicts failures and generates reports on demand." },
];

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--neon-cyan)]">FAQ</div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Answers, upfront.</h2>
        </div>
        <div className="mt-10 space-y-2">
          {faqs.map((f, i) => (
            <div key={f.q} className="glass overflow-hidden rounded-2xl">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-[var(--gradient-vivid)]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-base font-semibold">CloudVision AI</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">© 2026 CloudVision Labs, Inc. Built on the edge.</p>
        </div>
        <div className="flex items-center gap-3">
          {[Github, Twitter, Linkedin].map((I, i) => (
            <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-muted-foreground ring-1 ring-white/10 hover:text-foreground">
              <I className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Nav />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
