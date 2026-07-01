import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { api, extractError, HAS_BACKEND } from "@/lib/api";
import { AuthShell, Field, SubmitButton } from "@/routes/login";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password · CloudVision AI" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s.token === "string" ? s.token : "" }),
  component: ResetPage,
});

function ResetPage() {
  const { token } = useSearch({ from: "/reset-password" });
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      if (!HAS_BACKEND) throw new Error("Backend is not configured.");
      await api.post("/api/auth/reset-password", { token, password });
      toast.success("Password updated — you can sign in now");
      void navigate({ to: "/login" });
    } catch (err) {
      toast.error(extractError(err, "Could not reset password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Choose a new password" subtitle="Make it strong — at least 8 characters">
      {!token ? (
        <div className="rounded-xl bg-[color:var(--danger)]/10 px-4 py-3 text-sm text-[color:var(--danger)] ring-1 ring-[color:var(--danger)]/20">
          Invalid or missing reset token. Please request a new reset link.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="New password" value={password} onChange={setPassword} autoComplete="new-password" required />
          <Field icon={<Lock className="h-4 w-4" />} type="password" placeholder="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" required />
          <SubmitButton loading={loading}>Update password</SubmitButton>
        </form>
      )}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Link to="/login" className="hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
