import { Router } from "express";
import { z } from "zod";
import { Alert } from "../models/Alert.js";
import { requireAuth, requirePermission } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", requirePermission("alerts:read"), async (_req, res) => {
  const list = await Alert.find().sort({ createdAt: -1 }).limit(200);
  res.json(list);
});

router.post("/", requirePermission("alerts:write"), async (req, res) => {
  const data = z.object({
    title: z.string().min(1).max(255),
    message: z.string().max(2000).optional(),
    severity: z.enum(["info", "warning", "critical"]).optional(),
    server: z.string().optional(),
  }).parse(req.body);
  const created = await Alert.create(data);
  res.status(201).json(created);
});

export default router;
