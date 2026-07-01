import { Router } from "express";
import { Log } from "../models/Log.js";
import { requireAuth, requirePermission } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", requirePermission("logs:read"), async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 200), 1000);
  const filter = {};
  if (req.query.level) filter.level = String(req.query.level).toUpperCase();
  if (req.query.q) {
    const q = String(req.query.q);
    filter.$or = [
      { message: { $regex: q, $options: "i" } },
      { service: { $regex: q, $options: "i" } },
    ];
  }
  const list = await Log.find(filter).sort({ timestamp: -1 }).limit(limit);
  res.json(list);
});

export default router;
