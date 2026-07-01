// Hermes AI Cloud Copilot — client hooks + types.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, HAS_BACKEND } from "@/lib/api";

export interface HermesResponse {
  success: boolean;
  message: string;
  recommendations: string[];
  metadata: Record<string, unknown>;
}

export interface HermesHistoryItem {
  _id: string;
  role: "user" | "assistant" | "system";
  message: string;
  intent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export function useHermesHistory() {
  return useQuery({
    queryKey: ["hermes", "history"],
    queryFn: async () => {
      if (!HAS_BACKEND) return [] as HermesHistoryItem[];
      const r = await api.get<HermesResponse>("/api/agent/history");
      return (r.data.metadata?.items as HermesHistoryItem[]) ?? [];
    },
  });
}

export function useHermesChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const r = await api.post<HermesResponse>("/api/agent/chat", { message });
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hermes", "history"] }),
  });
}

export function useHermesAnalyze() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.post<HermesResponse>("/api/agent/analyze")).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hermes", "history"] }),
  });
}

export function useHermesClear() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.delete<HermesResponse>("/api/agent/history")).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["hermes", "history"] }),
  });
}
