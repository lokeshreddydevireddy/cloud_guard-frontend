// Centralized axios instance with JWT + refresh-token handling.
// Talks to the Express backend under `server/`.
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

export const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
export const HAS_BACKEND = API_URL.length > 0;

/**
 * Backend is optional: when VITE_API_URL is unset the app runs in "demo mode"
 * (auth guard is skipped and queries return empty states) so the preview stays
 * usable without a running server.
 */
export const api = axios.create({
  baseURL: API_URL || "/",
  withCredentials: true, // send httpOnly refresh cookie
  headers: { "Content-Type": "application/json" },
});

const ACCESS_TOKEN_KEY = "cv_access_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Refresh-token queue ---
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post(
      `${API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const token = res.data?.accessToken ?? null;
    setAccessToken(token);
    return token;
  } catch {
    setAccessToken(null);
    return null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    if (status !== 401 || !original || original._retry || !HAS_BACKEND) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) return reject(error);
          original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${token}` };
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    const token = await refreshAccessToken();
    isRefreshing = false;
    flushQueue(token);

    if (!token) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
      return Promise.reject(error);
    }
    original.headers = { ...(original.headers ?? {}), Authorization: `Bearer ${token}` };
    return api(original);
  },
);

export function extractError(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(err)) {
    return (err.response?.data as { message?: string } | undefined)?.message ?? err.message ?? fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
