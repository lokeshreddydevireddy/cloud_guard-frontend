import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Protected } from "@/components/AuthGate";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · CloudVision AI" }] }),
  component: () => (
    <Protected>
      <DashboardLayout />
    </Protected>
  ),
});
