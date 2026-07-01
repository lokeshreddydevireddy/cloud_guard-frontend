// Hermes AI Cloud Copilot — controller.
import { z } from "zod";
import { AgentHistory } from "../models/AgentHistory.js";
import { AgentAction } from "../models/AgentAction.js";
import { runChat, runAnalyze } from "../services/hermes_service.js";

const chatSchema = z.object({ message: z.string().min(1).max(2000) });
const actionSchema = z.object({
  action: z.enum(["stop_ec2_instance", "start_ec2_instance", "reboot_ec2_instance", "create_cloudwatch_alarm"]),
  params: z.record(z.any()).optional(),
  confirm: z.boolean().optional(),
});

function ok(res, payload) {
  res.json({ success: true, message: payload.message, recommendations: payload.recommendations ?? [], metadata: payload.metadata ?? {} });
}

export async function chat(req, res) {
  const { message } = chatSchema.parse(req.body);
  const result = await runChat({ message });
  await AgentHistory.create({ user: req.user._id, role: "user", message, intent: result.intent });
  await AgentHistory.create({
    user: req.user._id,
    role: "assistant",
    message: result.message,
    intent: result.intent,
    metadata: { recommendations: result.recommendations, ...result.metadata },
  });
  ok(res, result);
}

export async function analyze(req, res) {
  const result = await runAnalyze();
  await AgentHistory.create({
    user: req.user._id,
    role: "assistant",
    message: result.message,
    intent: "analyze",
    metadata: { recommendations: result.recommendations, ...result.metadata },
  });
  ok(res, result);
}

export async function action(req, res) {
  const { action: name, params = {}, confirm = false } = actionSchema.parse(req.body);
  if (!confirm) {
    const pending = await AgentAction.create({
      user: req.user._id,
      action: name,
      params,
      status: "pending",
      readOnly: false,
    });
    return res.status(202).json({
      success: false,
      message: `Action "${name}" requires confirm=true.`,
      recommendations: [],
      metadata: { pendingId: pending._id, action: name, params },
    });
  }
  // Phase 1 is read-only — record intent, do not execute.
  const record = await AgentAction.create({
    user: req.user._id,
    action: name,
    params,
    status: "rejected",
    result: { reason: "Write actions disabled in Phase 1." },
    readOnly: false,
  });
  res.status(403).json({
    success: false,
    message: "Hermes is in read-only mode. Write actions are disabled.",
    recommendations: [],
    metadata: { id: record._id },
  });
}

export async function history(req, res) {
  const items = await AgentHistory.find({ user: req.user._id }).sort({ createdAt: 1 }).limit(200).lean();
  res.json({ success: true, message: "ok", recommendations: [], metadata: { items } });
}

export async function clearHistory(req, res) {
  const r = await AgentHistory.deleteMany({ user: req.user._id });
  res.json({ success: true, message: "History cleared.", recommendations: [], metadata: { deleted: r.deletedCount } });
}
