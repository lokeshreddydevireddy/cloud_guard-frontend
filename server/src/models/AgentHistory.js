import mongoose from "mongoose";

const agentHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    message: { type: String, required: true },
    intent: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export const AgentHistory = mongoose.model("AgentHistory", agentHistorySchema);
