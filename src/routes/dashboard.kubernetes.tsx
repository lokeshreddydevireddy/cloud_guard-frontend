import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/GlassCard";
import { PageHeader, StatusPill } from "@/components/PageHeader";
import { Boxes, Layers, Server, Network, Package } from "lucide-react";

export const Route = createFileRoute("/dashboard/kubernetes")({
  head: () => ({ meta: [{ title: "Kubernetes · CloudVision AI" }] }),
  component: K8s,
});

const nodes = [
  { name: "node-a1", cpu: "12/32", pods: 34, status: "healthy" },
  { name: "node-a2", cpu: "18/32", pods: 41, status: "healthy" },
  { name: "node-b1", cpu: "24/32", pods: 38, status: "warning" },
  { name: "node-c1", cpu: "9/32", pods: 29, status: "healthy" },
];
const deployments = [
  { name: "api-gateway", replicas: "6/6", namespace: "prod", status: "healthy" },
  { name: "checkout", replicas: "4/4", namespace: "prod", status: "healthy" },
  { name: "recommender", replicas: "2/3", namespace: "ml", status: "warning" },
  { name: "billing-worker", replicas: "3/3", namespace: "prod", status: "healthy" },
];

function K8s() {
  return (
    <div>
      <PageHeader title="Kubernetes" subtitle="Cluster health across production and ML" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { icon: Server, label: "Nodes", value: "12" },
          { icon: Boxes, label: "Pods", value: "142" },
          { icon: Layers, label: "Deployments", value: "38" },
          { icon: Network, label: "Services", value: "56" },
          { icon: Package, label: "Namespaces", value: "9" },
        ].map((s, i) => (
          <GlassCard key={i} className="p-4">
            <s.icon className="h-4 w-4 text-[color:var(--neon-cyan)]" />
            <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
            <div className="font-display text-2xl font-bold">{s.value}</div>
          </GlassCard>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="font-display text-lg font-semibold">Nodes</div>
          <div className="mt-3 divide-y divide-white/5">
            {nodes.map(n => (
              <div key={n.name} className="flex items-center justify-between py-2.5 text-sm">
                <div className="font-mono">{n.name}</div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>CPU {n.cpu}</span>
                  <span>{n.pods} pods</span>
                  <StatusPill level={n.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div className="font-display text-lg font-semibold">Deployments</div>
          <div className="mt-3 divide-y divide-white/5">
            {deployments.map(d => (
              <div key={d.name} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-[11px] text-muted-foreground">{d.namespace}</div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-mono text-muted-foreground">{d.replicas}</span>
                  <StatusPill level={d.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
