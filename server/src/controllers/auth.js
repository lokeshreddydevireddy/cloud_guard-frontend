import crypto from "crypto";
import { z } from "zod";
import { User } from "../models/User.js";
import {
  signAccessToken, signRefreshToken, verifyRefresh,
  REFRESH_COOKIE, refreshCookieOptions,
} from "../utils/jwt.js";
import { sendMail } from "../services/mailer.js";
import { config } from "../config/env.js";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200),
  company: z.string().max(120).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

function issueTokens(user, res) {
  const accessToken = signAccessToken(user._id.toString(), user.role);
  const refreshToken = signRefreshToken(user._id.toString());
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
  return accessToken;
}

export async function register(req, res) {
  const data = registerSchema.parse(req.body);
  const existing = await User.findOne({ email: data.email });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const isFirst = (await User.countDocuments()) === 0;
  const user = await User.create({
    ...data,
    role: isFirst ? "admin" : "viewer",
    emailVerificationToken: crypto.randomBytes(24).toString("hex"),
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const verifyUrl = `${config.clientUrl}/verify-email?token=${user.emailVerificationToken}`;
  await sendMail({
    to: user.email,
    subject: "Verify your CloudVision account",
    text: `Welcome to CloudVision! Verify your email: ${verifyUrl}`,
    html: `<p>Welcome to CloudVision!</p><p><a href="${verifyUrl}">Verify your email</a></p>`,
  });

  const accessToken = issueTokens(user, res);
  res.status(201).json({ user: user.toSafeJSON(), accessToken });
}

export async function login(req, res) {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  user.lastLogin = new Date();
  await user.save();

  const accessToken = issueTokens(user, res);
  res.json({ user: user.toSafeJSON(), accessToken });
}

export async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ message: "Missing refresh token" });
  try {
    const decoded = verifyRefresh(token);
    const user = await User.findById(decoded.sub);
    if (!user) return res.status(401).json({ message: "Invalid session" });
    const accessToken = signAccessToken(user._id.toString(), user.role);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export async function logout(_req, res) {
  res.clearCookie(REFRESH_COOKIE, { ...refreshCookieOptions(), maxAge: 0 });
  res.json({ ok: true });
}

export async function profile(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

export async function updateProfile(req, res) {
  const schema = z.object({
    name: z.string().min(1).max(120).optional(),
    company: z.string().max(120).optional(),
    avatar: z.string().max(1024).optional(),
  });
  const data = schema.parse(req.body);
  Object.assign(req.user, data);
  await req.user.save();
  res.json({ user: req.user.toSafeJSON() });
}

export async function forgotPassword(req, res) {
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  const user = await User.findOne({ email });
  if (user) {
    user.passwordResetToken = crypto.randomBytes(24).toString("hex");
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    const resetUrl = `${config.clientUrl}/reset-password?token=${user.passwordResetToken}`;
    await sendMail({
      to: user.email,
      subject: "Reset your CloudVision password",
      text: `Reset link: ${resetUrl} (valid for 1 hour)`,
      html: `<p><a href="${resetUrl}">Reset your password</a> — valid for 1 hour.</p>`,
    });
  }
  // Always return 200 to prevent user enumeration
  res.json({ ok: true });
}

export async function resetPassword(req, res) {
  const { token, password } = z.object({
    token: z.string().min(10),
    password: z.string().min(8).max(200),
  }).parse(req.body);
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  }).select("+password +passwordResetToken +passwordResetExpires");
  if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ ok: true });
}

export async function verifyEmail(req, res) {
  const { token } = z.object({ token: z.string().min(10) }).parse(req.body);
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationToken +emailVerificationExpires");
  if (!user) return res.status(400).json({ message: "Invalid or expired verification token" });
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
  res.json({ ok: true });
}

export async function resendVerification(req, res) {
  if (!req.user) return res.status(401).json({ message: "Sign in required" });
  if (req.user.emailVerified) return res.json({ ok: true });
  req.user.emailVerificationToken = crypto.randomBytes(24).toString("hex");
  req.user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await req.user.save();
  const verifyUrl = `${config.clientUrl}/verify-email?token=${req.user.emailVerificationToken}`;
  await sendMail({
    to: req.user.email,
    subject: "Verify your CloudVision account",
    text: `Verify link: ${verifyUrl}`,
    html: `<p><a href="${verifyUrl}">Verify your email</a></p>`,
  });
  res.json({ ok: true });
}
