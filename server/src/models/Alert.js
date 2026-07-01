import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, default: "" },
    severity: { type: String, enum: ["info", "warning", "critical"], default: "info", index: true },
    status: { type: String, enum: ["open", "acknowledged", "resolved"], default: "open", index: true },
    server: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
  },
  { timestamps: true },
);

export const Alert = mongoose.model("Alert", alertSchema);
