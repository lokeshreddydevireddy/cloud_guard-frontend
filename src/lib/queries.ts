// React Query hooks for all dashboard resources. Each hook talks to the
// Express backend under `server/`. When VITE_API_URL is not configured the
// queries resolve to empty results so the UI renders empty-state cards.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, HAS_BACKEND } from "@/lib/api";

export interface ServerRecord {
  _id: string;
  id?: string;
  name: string;
  hostname: string;
  ip: string;
  operatingSystem: string;
  region: string;
  status: "healthy" | "warning" | "critical" | "offline";
  cpu: number;
  ram: number;
  disk: number;
  uptime: number;
  temp?: number;
  updatedAt?: string;
}

export interface AlertRecord {
  _id: string;
  title: string;
  message: string;
  severity: "critical" | "warning" | "info";
  status: "open" | "acknowledged" | "resolved";
  server?: string | null;
  createdAt: string;
}

export interface LogRecord {
  _id: string;
  server?: string | null;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  service?: string;
  timestamp: string;
}

export interface NotificationRecord {
  _id: string;
  user: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardOverview {
  totals: { servers: number; alerts: number; containers: number; regions: number };
  healthy: number;
  warning: number;
  critical: number;
  throughput: { t: number; label: string; value: number }[];
  cpuTimeline: { t: number; label: string; value: number }[];
  ramTimeline: { t: number; label: string; value: number }[];
  distribution: { name: string; value: number }[];
  recentAlerts: AlertRecord[];
}

async function safeGet<T>(url: string, fallback: T): Promise<T> {
  if (!HAS_BACKEND) return fallback;
  const res = await api.get<T>(url);
  return res.data;
}

// ----- Dashboard overview -----
export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      safeGet<DashboardOverview>("/api/dashboard", {
        totals: { servers: 0, alerts: 0, containers: 0, regions: 0 },
        healthy: 0,
        warning: 0,
        critical: 0,
        throughput: [],
        cpuTimeline: [],
        ramTimeline: [],
        distribution: [],
        recentAlerts: [],
      }),
    refetchInterval: HAS_BACKEND ? 15_000 : false,
  });
}

// ----- Servers -----
export function useServers() {
  return useQuery({
    queryKey: ["servers"],
    queryFn: () => safeGet<ServerRecord[]>("/api/servers", []),
    refetchInterval: HAS_BACKEND ? 15_000 : false,
  });
}

export function useCreateServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<ServerRecord>) => api.post("/api/servers", input).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["servers"] }),
  });
}

export function useUpdateServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: Partial<ServerRecord> & { id: string }) =>
      api.put(`/api/servers/${id}`, input).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["servers"] }),
  });
}

export function useDeleteServer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/servers/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["servers"] }),
  });
}

// ----- Alerts -----
export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => safeGet<AlertRecord[]>("/api/alerts", []),
    refetchInterval: HAS_BACKEND ? 20_000 : false,
  });
}

// ----- Logs -----
export function useLogs(params?: { q?: string; level?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.level) search.set("level", params.level);
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return useQuery({
    queryKey: ["logs", params ?? {}],
    queryFn: () => safeGet<LogRecord[]>(`/api/logs${qs ? `?${qs}` : ""}`, []),
    refetchInterval: HAS_BACKEND ? 10_000 : false,
  });
}

// ----- Notifications -----
export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => safeGet<NotificationRecord[]>("/api/notifications", []),
  });
}

// ----- Settings -----
export interface UserSettings {
  timezone: string;
  language: string;
  theme: string;
  notifications: { email: boolean; slack: boolean; push: boolean };
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () =>
      safeGet<UserSettings>("/api/settings", {
        timezone: "UTC",
        language: "en",
        theme: "dark",
        notifications: { email: true, slack: false, push: true },
      }),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<UserSettings>) => api.put("/api/settings", input).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
