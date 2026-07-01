import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function signAccessToken(userId, role) {
  return jwt.sign({ sub: userId, role }, config.jwt.accessSecret, { expiresIn: config.jwt.accessTtl });
}

export function signRefreshToken(userId) {
  return jwt.sign({ sub: userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshTtl });
}

export function verifyAccess(token) {
  return jwt.verify(token, config.jwt.accessSecret);
}

export function verifyRefresh(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}

export const REFRESH_COOKIE = "cv_refresh";

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    secure: config.nodeEnv === "production",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
