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

const roomSchema = new mongoose.Schema({
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
});

export default mongoose.model("Room", roomSchema);
