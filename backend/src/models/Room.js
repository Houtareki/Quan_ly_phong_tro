import mongoose from "mongoose";
import { ROOM_STATUS } from "../constants/enums.js";

const assetSchema = new mongoose.Schema(
  {
    name: String,
    quantity: Number,
    status: String,
  }, 
  { _id: false },
);

const serviceSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    unit: String,
  },
  { _id: false },
);

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roomType: {
      type: String,
      required: true,
      trim: true,
    },
    defaultPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    area: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(ROOM_STATUS),
      default: ROOM_STATUS.AVAILABLE,
    },
    assets: [assetSchema],
    services: [serviceSchema],

    // ── Thêm mới ───────────────────────────────────────────
    // Chủ trọ sở hữu phòng này (thành viên làm phần Chủ trọ sẽ dùng field này)
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Admin duyệt bài: mặc định false, chờ admin approve
    isApproved: {
      type: Boolean,
      default: false,
    },
    // Lý do từ chối (nếu có)
    approvalNote: {
      type: String,
      default: "",
    },
    // ───────────────────────────────────────────────────────
  },
  { timestamps: true }, // thêm createdAt, updatedAt
);

export default mongoose.model("Room", roomSchema);