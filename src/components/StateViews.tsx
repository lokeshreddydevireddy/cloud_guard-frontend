// Reusable loading / error / empty state views used across dashboard pages.
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingScreen({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-[color:var(--neon-cyan)]" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function SkeletonRow({ className = "" }: { className?: string }) {
  return <div className={`h-4 animate-pulse rounded-md bg-white/5 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5">
      <SkeletonRow className="w-1/3" />
      <SkeletonRow className="mt-3 h-8 w-2/3" />
      <SkeletonRow className="mt-4 w-full" />
    </div>
  );
}

export function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl p-8 text-center">
      <AlertCircle className="mb-2 h-6 w-6 text-[color:var(--danger)]" />
      <div className="font-display text-base font-semibold">Failed to load</div>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium ring-1 ring-white/10 hover:bg-white/15"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyView({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl p-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <div className="mt-3 font-display text-base font-semibold">{title}</div>
      {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
