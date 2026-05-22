import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["INCOME", "EXPENSE"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
