// Script reset all room contracts
// Chạy: node src/scripts/resetContracts.js

import dotenv from "dotenv";
import connectDB from "../configs/db.js";
import Room from "../models/Room.js";
import { ROOM_STATUS } from "../constants/enums.js";

dotenv.config();

const resetContracts = async () => {
  await connectDB();

  try {
    const result = await Room.updateMany(
      {},
      { status: ROOM_STATUS.AVAILABLE, contractId: null }
    );

    console.log(`✅ Đã reset ${result.modifiedCount} phòng về trạng thái AVAILABLE`);
    console.log("Tất cả phòng giờ đã sẵn sàng để tạo hợp đồng mới");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi reset hợp đồng:", error.message);
    process.exit(1);
  }
};

resetContracts();
