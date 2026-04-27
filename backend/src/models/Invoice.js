import mongoose from "mongoose";

const serviceFeeSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    quantity: Number,
    total: Number,
  },
  { _id: false },
);

const paymentSchema = new mongoose.Schema(
  {
    paidAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["CASH", "BANK_TRANSFER"],
      default: "CASH",
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

const invoiceSchema = new mongoose.Schema({
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
  roomPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  utilityReadings: {
    oldElectric: {
      type: Number,
      default: 0,
    },
    newElectric: {
      type: Number,
      default: 0,
    },
    electricPrice: {
      type: Number,
      default: 0,
    },
    oldWater: {
      type: Number,
      default: 0,
    },
    newWater: {
      type: Number,
      default: 0,
    },
    waterPrice: {
      type: Number,
      default: 0,
    },
  },
  serviceFees: [serviceFeeSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["UNPAID", "PARTIALLY_PAID", "PAID", "OVERDUE"],
    default: "UNPAID",
  },
  paymentHistory: [paymentSchema],
});

invoiceSchema.index({ contractId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Invoice", invoiceSchema);
