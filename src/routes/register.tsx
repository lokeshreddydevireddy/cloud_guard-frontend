import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail, Lock, User, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";
import { extractError, HAS_BACKEND } from "@/lib/api";
import { AuthShell, Field, SubmitButton } from "@/routes/login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account · CloudVision AI" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) return toast.error("Password must be at least 8 characters");
    setLoading(true);
    try {
      if (!HAS_BACKEND) throw new Error("Backend is not configured. Set VITE_API_URL to your API URL.");
      await register(form);
      toast.success("Account created — please verify your email");
      void navigate({ to: "/verify-email" });
    } catch (err) {
      toast.error(extractError(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your workspace" subtitle="Free trial · No credit card required">
      <form onSubmit={submit} className="space-y-4">
        <Field icon={<User className="h-4 w-4" />} placeholder="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="Work email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} autoComplete="email" required />
        <Field icon={<Building2 className="h-4 w-4" />} placeholder="Company (optional)" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
        <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="Password (min. 8 characters)" value={form.password} onChange={(v) => setForm({ ...form, password: v })} autoComplete="new-password" required />
        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-foreground hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
