import mongoose from "mongoose";
import { INVOICE_STATUS, PAYMENT_METHOD } from "../constants/enums.js";

const serviceFeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const paymentSchema = new mongoose.Schema(
  {
    paidAmount: {
      type: Number,
      required: true,
      min: 1,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHOD),
      default: PAYMENT_METHOD.CASH,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const invoiceSchema = new mongoose.Schema(
  {
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
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    roomPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    utilityReading: {
      oldElectric: { type: Number, default: 0, min: 0 },
      newElectric: { type: Number, default: 0, min: 0 },
      electricPrice: { type: Number, default: 0, min: 0 },
      oldWater: { type: Number, default: 0, min: 0 },
      newWater: { type: Number, default: 0, min: 0 },
      waterPrice: { type: Number, default: 0, min: 0 },
    },
    serviceFees: [serviceFeeSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(INVOICE_STATUS),
      default: INVOICE_STATUS.UNPAID,
    },
    paymentHistory: [paymentSchema],
  },
  { timestamps: true },
);

invoiceSchema.index({ contractId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Invoice", invoiceSchema);
