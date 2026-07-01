import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import { extractError, HAS_BACKEND } from "@/lib/api";
import { ParticleBackground } from "@/components/ParticleBackground";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · CloudVision AI" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : "/dashboard" }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!HAS_BACKEND) throw new Error("Backend is not configured. Set VITE_API_URL to your API URL.");
      await login(email, password);
      toast.success("Welcome back");
      void navigate({ to: redirect || "/dashboard" });
    } catch (err) {
      toast.error(extractError(err, "Invalid credentials"));
    } finally {
      setLoading(false);
    }
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to your CloudVision workspace">
    <form onSubmit={submit} className="space-y-4">
      <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@company.com" value={email} onChange={setEmail} autoComplete="email" required />
      <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="Password" value={password} onChange={setPassword} autoComplete="current-password" required />
      <div className="flex justify-end">
        <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot password?</Link>
      </div>
      <SubmitButton loading={loading}>Sign in</SubmitButton>
    </form>
    <p className="mt-6 text-center text-xs text-muted-foreground">
      No account? <Link to="/register" className="font-medium text-foreground hover:underline">Create one</Link>
    </p>
  </AuthShell>;
}

/* ------- shared shell + primitives (kept local to avoid extra components) ------- */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground density={50} />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-60"
        style={{ background: "radial-gradient(ellipse 50% 50% at 50% 0%, color-mix(in oklab, var(--neon-purple) 30%, transparent), transparent 70%)" }} />
      <div className="relative z-10 grid min-h-screen place-items-center px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="glass w-full max-w-md rounded-3xl p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          <Link to="/" className="mb-6 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-vivid)]"><Zap className="h-5 w-5 text-white" /></div>
            <div><div className="font-display text-base font-bold">CloudVision</div><div className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Monitoring</div></div>
          </Link>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
          {!HAS_BACKEND && (
            <p className="mt-4 rounded-lg bg-[color:var(--warning)]/10 px-3 py-2 text-[11px] text-[color:var(--warning)] ring-1 ring-[color:var(--warning)]/20">
              Backend not configured. Set VITE_API_URL in .env to enable authentication.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export function Field({ icon, type = "text", placeholder, value, onChange, autoComplete, required }: {
  icon?: React.ReactNode; type?: string; placeholder: string; value: string; onChange: (v: string) => void; autoComplete?: string; required?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 focus-within:ring-[color:var(--neon-cyan)]/40">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete} required={required}
        className="w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none" />
    </label>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button disabled={loading} type="submit"
      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[var(--gradient-vivid)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_var(--neon-blue)] transition-transform hover:scale-[1.01] disabled:opacity-60">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{children}<ArrowRight className="h-4 w-4" /></>}
    </button>
  );
}
