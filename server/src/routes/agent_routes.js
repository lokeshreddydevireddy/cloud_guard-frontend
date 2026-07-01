// Hermes AI Cloud Copilot — routes.
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { chat, analyze, action, history, clearHistory } from "../controllers/hermes_controller.js";

const router = Router();
router.use(requireAuth);

router.post("/chat", chat);
router.post("/analyze", analyze);
router.post("/action", action);
router.get("/history", history);
router.delete("/history", clearHistory);

export default router;
