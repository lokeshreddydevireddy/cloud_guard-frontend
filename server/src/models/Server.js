import mongoose from "mongoose";

const serverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hostname: { type: String, required: true, trim: true },
    ip: { type: String, required: true, trim: true },
    operatingSystem: { type: String, default: "" },
    region: { type: String, default: "" },
    status: { type: String, enum: ["healthy", "warning", "critical", "offline"], default: "healthy" },
    cpu: { type: Number, min: 0, max: 100, default: 0 },
    ram: { type: Number, min: 0, max: 100, default: 0 },
    disk: { type: Number, min: 0, max: 100, default: 0 },
    temp: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 }, // seconds
    tags: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const Server = mongoose.model("Server", serverSchema);
