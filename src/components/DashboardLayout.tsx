import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard, Server, Container, Boxes, Cloud, HardDrive, Network,
  ScrollText, AlertTriangle, LineChart, Sparkles, Settings, LogOut,
  Search, BellDot, Sun, Menu, Shield, Zap, Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

const nav = [
  { section: "Overview", items: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/dashboard/infrastructure", label: "Infrastructure", icon: Cloud },
    { to: "/dashboard/servers", label: "Servers", icon: Server },
  ]},
  { section: "Compute", items: [
    { to: "/dashboard/docker", label: "Docker", icon: Container },
    { to: "/dashboard/kubernetes", label: "Kubernetes", icon: Boxes },
  ]},
  { section: "Platform", items: [
    { to: "/dashboard/storage", label: "Storage", icon: HardDrive },
    { to: "/dashboard/networking", label: "Networking", icon: Network },
    { to: "/dashboard/security", label: "Security", icon: Shield },
  ]},
  { section: "Monitoring", items: [
    { to: "/dashboard/alerts", label: "Alerts", icon: AlertTriangle },
    { to: "/dashboard/logs", label: "Logs", icon: ScrollText },
    { to: "/dashboard/analytics", label: "Analytics", icon: LineChart },
  ]},
  { section: "Intelligence", items: [
    { to: "/dashboard/ai-assistant", label: "Cloud AI", icon: Sparkles },
    { to: "/dashboard/hermes", label: "Hermes Copilot", icon: Bot },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
  ]},
];

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={cn(
          "glass-strong fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto rounded-r-3xl border-r border-white/5 px-4 py-5 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Link to="/" className="mb-6 flex items-center gap-2.5 px-2">
          <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-vivid)] shadow-[0_0_24px_-4px_var(--neon-cyan)]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-display text-base font-bold tracking-tight">CloudVision</div>
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">AI Monitoring</div>
          </div>
        </Link>

        <nav className="flex-1 space-y-5">
          {nav.map((group) => (
            <div key={group.section}>
              <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = item.exact ? path === item.to : path.startsWith(item.to);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "bg-white/8 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-[var(--gradient-cyan)]"
                        />
                      )}
                      <Icon className={cn("h-4 w-4 shrink-0", active && "text-[color:var(--neon-cyan)]")} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <UserFooter />
      </aside>
    </>
  );
}

function UserFooter() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const initials = (user?.name ?? "Guest User").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  async function handleLogout() {
    await logout();
    toast.success("Signed out");
    void navigate({ to: "/login" });
  }
  return (
    <div className="glass mt-4 rounded-2xl p-3">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] font-semibold text-white">
          {initials || "GU"}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{user?.name ?? "Guest"}</div>
          <div className="truncate text-[11px] text-muted-foreground">{user?.email ?? "not signed in"}</div>
        </div>
        <button onClick={handleLogout} title="Sign out"
          className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="glass sticky top-0 z-20 -mx-4 mb-6 flex items-center gap-3 rounded-2xl px-4 py-2.5 md:mx-0">
      <button onClick={onMenu} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/5 md:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 ring-1 ring-white/5 focus-within:ring-[color:var(--neon-cyan)]/40">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search servers, logs, alerts…"
          className="w-full bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <kbd className="hidden rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">⌘K</kbd>
      </div>
      <div className="flex items-center gap-1">
        <button className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-white/5">
          <BellDot className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[color:var(--neon-pink)] shadow-[0_0_8px_var(--neon-pink)]" />
        </button>
        <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/5">
          <Sun className="h-4.5 w-4.5" />
        </button>
        <UserAvatarBadge />
      </div>
    </header>
  );
}

function UserAvatarBadge() {
  const user = useAuthStore((s) => s.user);
  const initials = (user?.name ?? "GU").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-[var(--gradient-primary)] text-xs font-semibold text-white ring-2 ring-white/10">
      {initials || "GU"}
    </div>
  );
}


export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar open={open} setOpen={setOpen} />
      <main className="min-w-0 flex-1 px-4 py-4 md:px-8 md:py-6">
        <Topbar onMenu={() => setOpen(true)} />
        <Outlet />
      </main>
    </div>
  );
}
