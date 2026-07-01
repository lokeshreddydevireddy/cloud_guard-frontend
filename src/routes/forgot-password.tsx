import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { api, extractError, HAS_BACKEND } from "@/lib/api";
import { AuthShell, Field, SubmitButton } from "@/routes/login";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password · CloudVision AI" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!HAS_BACKEND) throw new Error("Backend is not configured.");
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent — check your inbox");
    } catch (err) {
      toast.error(extractError(err, "Could not send reset email"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a secure reset link">
      {sent ? (
        <div className="rounded-xl bg-[color:var(--success)]/10 px-4 py-3 text-sm text-[color:var(--success)] ring-1 ring-[color:var(--success)]/20">
          If an account exists for <span className="font-mono">{email}</span>, a reset email is on the way.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@company.com" value={email} onChange={setEmail} required autoComplete="email" />
          <SubmitButton loading={loading}>Send reset link</SubmitButton>
        </form>
      )}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/login" className="hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
