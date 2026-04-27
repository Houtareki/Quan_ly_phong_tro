import mongoose from "mongoose";

const contractSchema = new mongoose.Schema(
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
      min: 0,
    },
    monthlyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Contract", contractSchema);
