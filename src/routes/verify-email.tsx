import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MailCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, extractError, HAS_BACKEND } from "@/lib/api";
import { AuthShell } from "@/routes/login";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify email · CloudVision AI" }] }),
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s.token === "string" ? s.token : "" }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = useSearch({ from: "/verify-email" });
  const [state, setState] = useState<"idle" | "verifying" | "success" | "error">(token ? "verifying" : "idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        if (!HAS_BACKEND) throw new Error("Backend is not configured.");
        await api.post("/api/auth/verify-email", { token });
        setState("success");
      } catch (err) {
        setState("error");
        setMessage(extractError(err, "Verification failed"));
      }
    })();
  }, [token]);

  async function resend() {
    try {
      if (!HAS_BACKEND) throw new Error("Backend is not configured.");
      await api.post("/api/auth/resend-verification");
      toast.success("Verification email sent");
    } catch (err) {
      toast.error(extractError(err));
    }
  }

  return (
    <AuthShell title="Verify your email" subtitle="One quick step to secure your account">
      <div className="grid place-items-center py-4 text-center">
        {state === "verifying" && <><Loader2 className="h-8 w-8 animate-spin text-[color:var(--neon-cyan)]" /><p className="mt-3 text-sm text-muted-foreground">Verifying…</p></>}
        {state === "idle" && (
          <>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--gradient-primary)]"><MailCheck className="h-6 w-6 text-white" /></div>
            <p className="mt-4 text-sm text-muted-foreground">We sent a verification link to your inbox.<br />Click it to activate your account.</p>
            <button onClick={resend} className="mt-4 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium ring-1 ring-white/10 hover:bg-white/15">Resend email</button>
          </>
        )}
        {state === "success" && (
          <>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--success)]/20"><MailCheck className="h-6 w-6 text-[color:var(--success)]" /></div>
            <p className="mt-4 text-sm">Your email is verified.</p>
            <Link to="/dashboard" className="mt-4 rounded-full bg-[var(--gradient-vivid)] px-4 py-1.5 text-xs font-semibold text-white">Continue to dashboard</Link>
          </>
        )}
        {state === "error" && (
          <>
            <p className="text-sm text-[color:var(--danger)]">{message}</p>
            <button onClick={resend} className="mt-4 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium ring-1 ring-white/10 hover:bg-white/15">Resend email</button>
          </>
        )}
      </div>
    </AuthShell>
  );
}
