import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    server: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    level: { type: String, enum: ["INFO", "WARN", "ERROR", "DEBUG"], default: "INFO", index: true },
    message: { type: String, required: true },
    service: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false },
);

logSchema.index({ message: "text", service: "text" });

export const Log = mongoose.model("Log", logSchema);
