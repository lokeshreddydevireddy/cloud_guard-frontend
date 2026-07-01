import { Router } from "express";
import { z } from "zod";
import { Server } from "../models/Server.js";
import { requireAuth, requirePermission } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

const serverSchema = z.object({
  name: z.string().min(1).max(120),
  hostname: z.string().min(1).max(255),
  ip: z.string().min(1).max(64),
  operatingSystem: z.string().max(120).optional(),
  region: z.string().max(64).optional(),
  status: z.enum(["healthy", "warning", "critical", "offline"]).optional(),
  cpu: z.number().min(0).max(100).optional(),
  ram: z.number().min(0).max(100).optional(),
  disk: z.number().min(0).max(100).optional(),
  temp: z.number().optional(),
  uptime: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

router.get("/", requirePermission("servers:read"), async (_req, res) => {
  const list = await Server.find().sort({ createdAt: -1 });
  res.json(list);
});

router.post("/", requirePermission("servers:write"), async (req, res) => {
  const data = serverSchema.parse(req.body);
  const created = await Server.create({ ...data, owner: req.user._id });
  res.status(201).json(created);
});

router.put("/:id", requirePermission("servers:write"), async (req, res) => {
  const data = serverSchema.partial().parse(req.body);
  const updated = await Server.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

router.delete("/:id", requirePermission("servers:write"), async (req, res) => {
  const deleted = await Server.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
