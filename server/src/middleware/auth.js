import { verifyAccess } from "../utils/jwt.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization ?? "";
    if (!header.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });
    const decoded = verifyAccess(header.slice(7));
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ message: "Invalid session" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

const PERMISSIONS = {
  admin: ["*"],
  devops: ["servers:read", "servers:write", "alerts:read", "alerts:write", "logs:read", "settings:read"],
  cloud_engineer: ["servers:read", "servers:write", "alerts:read", "logs:read", "settings:read"],
  viewer: ["servers:read", "alerts:read", "logs:read", "settings:read"],
};

export function requirePermission(permission) {
  return (req, res, next) => {
    const list = PERMISSIONS[req.user?.role] ?? [];
    if (list.includes("*") || list.includes(permission)) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
