import { CONTRACT_STATUS } from "../constants/enums.js";
import Contract from "../models/Contract.js";

export const getContractActive = async (req, res) => {
  try {
    const contracts = await Contract.find({ status: CONTRACT_STATUS.ACTIVE })
      .populate("roomId", "roomCode roomType defaultPrice services")
      .populate("tenantId", "fullname phone");

    res.status(200).json({
      message: "Lấy thông tin hợp đồng đang hoạt động thành công",
      data: contracts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin hợp đồng đang hoạt động",
      error: error.message,
    });
  }
};
