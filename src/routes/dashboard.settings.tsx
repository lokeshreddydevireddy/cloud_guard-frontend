import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader } from "@/components/PageHeader";
import { Key, Bell, Palette, Languages, Clock, Lock, User } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings · CloudVision AI" }] }),
  component: Settings,
});

const sections = [
  { icon: User, title: "Profile", desc: "Name, avatar, and contact." },
  { icon: Lock, title: "Password", desc: "Update your password." },
  { icon: Palette, title: "Theme", desc: "Dark, glass, and neon accents." },
  { icon: Key, title: "API Keys", desc: "Manage integration tokens." },
  { icon: Bell, title: "Notifications", desc: "Email, Slack, push." },
  { icon: Languages, title: "Language", desc: "Interface localization." },
  { icon: Clock, title: "Timezone", desc: "Reporting and display." },
];

function Settings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your workspace, security, and preferences" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((s, i) => (
          <GlassCard key={i} glow>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-primary)] text-white">
                <s.icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="font-display font-semibold">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
            </div>
            <button className="mt-4 w-full rounded-lg bg-white/5 py-2 text-xs font-medium ring-1 ring-white/10 hover:bg-white/10">
              Manage
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
