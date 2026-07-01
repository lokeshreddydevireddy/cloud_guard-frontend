import mongoose from "mongoose";

const agentActionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    action: { type: String, required: true },
    params: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ["pending", "confirmed", "executed", "rejected", "failed"], default: "pending" },
    result: { type: mongoose.Schema.Types.Mixed, default: null },
    readOnly: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const AgentAction = mongoose.model("AgentAction", agentActionSchema);
