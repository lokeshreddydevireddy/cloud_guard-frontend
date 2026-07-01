// Zustand auth store: persists the logged-in user + access-token status.
// Refresh tokens live in an httpOnly cookie set by the backend.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, setAccessToken, HAS_BACKEND, extractError } from "@/lib/api";

export type UserRole = "admin" | "devops" | "cloud_engineer" | "viewer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  emailVerified?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  status: "unknown" | "authenticated" | "unauthenticated";
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { name: string; email: string; password: string; company?: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      status: "unknown",

      async bootstrap() {
        if (!HAS_BACKEND) {
          set({ status: "unauthenticated" });
          return;
        }
        try {
          const res = await api.post("/api/auth/refresh");
          if (res.data?.accessToken) setAccessToken(res.data.accessToken);
          const me = await api.get("/api/auth/profile");
          set({ user: me.data.user, status: "authenticated" });
        } catch {
          set({ user: null, status: "unauthenticated" });
        }
      },

      async login(email, password) {
        const res = await api.post("/api/auth/login", { email, password });
        setAccessToken(res.data.accessToken);
        set({ user: res.data.user, status: "authenticated" });
      },

      async register(input) {
        const res = await api.post("/api/auth/register", input);
        if (res.data.accessToken) setAccessToken(res.data.accessToken);
        set({ user: res.data.user, status: "authenticated" });
      },

      async logout() {
        try {
          if (HAS_BACKEND) await api.post("/api/auth/logout");
        } catch (err) {
          console.warn("logout failed:", extractError(err));
        }
        setAccessToken(null);
        set({ user: null, status: "unauthenticated" });
      },

      setUser(u) {
        set({ user: u, status: u ? "authenticated" : "unauthenticated" });
      },
    }),
    {
      name: "cv_auth",
      partialize: (s) => ({ user: s.user }),
    },
  ),
);

/** Permission map — kept in one place so pages/components can gate UI. */
export const PERMISSIONS: Record<UserRole, readonly string[]> = {
  admin: ["*"],
  devops: ["servers:read", "servers:write", "alerts:read", "alerts:write", "logs:read", "settings:read"],
  cloud_engineer: ["servers:read", "servers:write", "alerts:read", "logs:read", "settings:read"],
  viewer: ["servers:read", "alerts:read", "logs:read", "settings:read"],
};

export function hasPermission(role: UserRole | undefined | null, permission: string): boolean {
  if (!role) return false;
  const list = PERMISSIONS[role];
  return list.includes("*") || list.includes(permission);
}
