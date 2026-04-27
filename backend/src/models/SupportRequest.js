import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issueType: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "DONE", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export default mongoose.model("SupportRequest", supportRequestSchema);
