// Session bootstrap + protected-route wrapper. Runs once on mount and
// redirects to /login when the backend is configured but no session exists.
import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuthStore, hasPermission, type UserRole } from "@/stores/auth";
import { HAS_BACKEND } from "@/lib/api";
import { LoadingScreen } from "@/components/StateViews";

export function SessionBootstrapper({ children }: { children: ReactNode }) {
  const { status, bootstrap } = useAuthStore();
  useEffect(() => {
    if (status === "unknown") void bootstrap();
  }, [status, bootstrap]);
  return <>{children}</>;
}

interface ProtectedProps {
  children: ReactNode;
  requirePermission?: string;
  requireRole?: UserRole | UserRole[];
}

export function Protected({ children, requirePermission, requireRole }: ProtectedProps) {
  const { user, status } = useAuthStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!HAS_BACKEND) return; // demo mode: no redirect
    if (status === "unauthenticated") {
      void navigate({ to: "/login", search: { redirect: pathname } as never });
    }
  }, [status, navigate, pathname]);

  if (!HAS_BACKEND) return <>{children}</>;
  if (status === "unknown") return <LoadingScreen label="Restoring session…" />;
  if (status === "unauthenticated") return <LoadingScreen label="Redirecting…" />;

  if (requirePermission && !hasPermission(user?.role, requirePermission)) {
    return <ForbiddenView />;
  }
  if (requireRole) {
    const allowed = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!user || !allowed.includes(user.role)) return <ForbiddenView />;
  }
  return <>{children}</>;
}

function ForbiddenView() {
  return (
    <div className="grid min-h-[60vh] place-items-center p-8">
      <div className="glass max-w-md rounded-2xl p-8 text-center">
        <div className="font-display text-2xl font-bold">Access denied</div>
        <p className="mt-2 text-sm text-muted-foreground">
          Your role doesn't have permission to view this section.
        </p>
      </div>
    </div>
  );
}
