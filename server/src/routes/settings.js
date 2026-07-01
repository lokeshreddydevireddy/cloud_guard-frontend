import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(req.user.settings);
});

router.put("/", async (req, res) => {
  const schema = z.object({
    timezone: z.string().max(64).optional(),
    language: z.string().max(16).optional(),
    theme: z.string().max(32).optional(),
    notifications: z
      .object({
        email: z.boolean().optional(),
        slack: z.boolean().optional(),
        push: z.boolean().optional(),
      })
      .optional(),
  });
  const data = schema.parse(req.body);
  req.user.settings = { ...req.user.settings.toObject(), ...data };
  if (data.notifications) {
    req.user.settings.notifications = { ...req.user.settings.notifications, ...data.notifications };
  }
  await req.user.save();
  res.json(req.user.settings);
});

export default router;
