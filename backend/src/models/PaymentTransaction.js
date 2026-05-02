import mongoose from "mongoose";
import {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../constants/enums.js";

const paymentTransactionSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      required: true,
    },
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
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.BANK_TRANSFER,
    },
    paymentCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    transferContent: {
      type: String,
      required: true,
      trim: true,
    },
    qrUrl: {
      type: String,
      trim: true,
    },
    bankCode: {
      type: String,
      trim: true,
    },
    bankAccountNumber: {
      type: String,
      trim: true,
    },
    bankAccountName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    note: {
      type: String,
      trim: true,
    },
    adminNote: {
      type: String,
      trim: true,
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    confirmedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: Date,
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

paymentTransactionSchema.index({ invoiceId: 1, status: 1 });
paymentTransactionSchema.index({ tenantId: 1, createdAt: -1 });
paymentTransactionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("PaymentTransaction", paymentTransactionSchema);
