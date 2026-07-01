// Mock time-series & metrics used across dashboard pages.
export function series(n: number, base: number, variance: number, seed = 1) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: n }, (_, i) => ({
    t: i,
    label: `${i}m`,
    value: Math.max(0, base + Math.sin(i / 3) * variance * 0.5 + (rand() - 0.5) * variance),
  }));
}

export const servers = [
  { id: "srv-01", name: "api-prod-01", os: "Ubuntu 22.04", ip: "10.0.1.14", region: "us-east-1", host: "ec2-a1", status: "healthy", cpu: 42, ram: 61, disk: 38, temp: 58 },
  { id: "srv-02", name: "worker-eu-02", os: "Debian 12", ip: "10.0.4.31", region: "eu-west-2", host: "ec2-b2", status: "warning", cpu: 78, ram: 84, disk: 55, temp: 71 },
  { id: "srv-03", name: "db-primary", os: "Amazon Linux", ip: "10.0.2.9", region: "us-east-1", host: "rds-a1", status: "healthy", cpu: 34, ram: 72, disk: 62, temp: 54 },
  { id: "srv-04", name: "cache-asia-01", os: "Alpine 3.19", ip: "10.0.7.4", region: "ap-southeast-1", host: "ec2-c3", status: "critical", cpu: 92, ram: 96, disk: 88, temp: 82 },
  { id: "srv-05", name: "gateway-01", os: "Ubuntu 22.04", ip: "10.0.0.2", region: "us-west-2", host: "ec2-d4", status: "healthy", cpu: 22, ram: 41, disk: 27, temp: 49 },
  { id: "srv-06", name: "analytics-01", os: "Ubuntu 22.04", ip: "10.0.3.11", region: "eu-central-1", host: "ec2-e5", status: "healthy", cpu: 51, ram: 58, disk: 44, temp: 61 },
];

export const containers = [
  { id: "c-1", name: "nginx-edge", image: "nginx:1.27", status: "running", cpu: 8, ram: 124 },
  { id: "c-2", name: "api-node", image: "node:22-alpine", status: "running", cpu: 34, ram: 512 },
  { id: "c-3", name: "postgres", image: "postgres:16", status: "running", cpu: 22, ram: 1024 },
  { id: "c-4", name: "redis", image: "redis:7", status: "running", cpu: 5, ram: 96 },
  { id: "c-5", name: "worker-jobs", image: "acme/worker:2.4", status: "stopped", cpu: 0, ram: 0 },
  { id: "c-6", name: "grafana", image: "grafana:11", status: "running", cpu: 12, ram: 220 },
];

export const alerts = [
  { id: 1, level: "critical", title: "CPU above 90% on cache-asia-01", time: "2m ago" },
  { id: 2, level: "warning", title: "RAM usage 84% on worker-eu-02", time: "6m ago" },
  { id: 3, level: "info", title: "Auto-scaling event triggered in eu-west-2", time: "18m ago" },
  { id: 4, level: "critical", title: "Database offline briefly (12s)", time: "34m ago" },
  { id: 5, level: "warning", title: "Disk usage 88% on cache-asia-01", time: "1h ago" },
];

export const awsResources = [
  { kind: "EC2 Instance", name: "api-prod-01", region: "us-east-1", status: "running", usage: "42%" },
  { kind: "RDS", name: "orders-primary", region: "us-east-1", status: "available", usage: "58%" },
  { kind: "Lambda", name: "image-resize", region: "us-west-2", status: "active", usage: "1.2k invocations/m" },
  { kind: "S3 Bucket", name: "cv-assets-prod", region: "us-east-1", status: "healthy", usage: "412 GB" },
  { kind: "CloudFront", name: "cdn-edge", region: "global", status: "deployed", usage: "3.1 TB/day" },
  { kind: "Route53", name: "cloudvision.ai", region: "global", status: "healthy", usage: "2.4M queries" },
  { kind: "Load Balancer", name: "alb-prod", region: "us-east-1", status: "active", usage: "18k req/m" },
  { kind: "Auto Scaling", name: "asg-api", region: "us-east-1", status: "scaling", usage: "4 → 6" },
  { kind: "VPC", name: "vpc-prod", region: "us-east-1", status: "healthy", usage: "12 subnets" },
  { kind: "IAM", name: "prod-role", region: "global", status: "compliant", usage: "42 policies" },
  { kind: "Security Group", name: "sg-web", region: "us-east-1", status: "healthy", usage: "3 rules" },
];
