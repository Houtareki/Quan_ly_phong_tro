import { CONTRACT_STATUS, ROOM_STATUS } from "../constants/enums.js";
import Contract from "../models/Contract.js";
import Room from "../models/Room.js";

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

export const createContract = async (req, res) => {
  try {
    const {
      roomId,
      tenantId,
      startDate,
      endDate,
      deposit,
      monthlyPrice,
      contractImages,
      notes,
    } = req.body;

    if (!roomId || !tenantId || !startDate || !endDate || monthlyPrice == null) {
      return res.status(400).json({
        message: "roomId, tenantId, startDate, endDate và monthlyPrice là bắt buộc",
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }

    if (room.status !== ROOM_STATUS.AVAILABLE) {
      return res.status(400).json({ message: "Chỉ có thể tạo hợp đồng cho phòng còn trống" });
    }

    const contract = await Contract.create({
      roomId,
      tenantId,
      startDate,
      endDate,
      deposit: deposit || 0,
      monthlyPrice,
      contractImages: contractImages && contractImages.length > 0 ? contractImages : [],
      notes,
      status: CONTRACT_STATUS.ACTIVE,
    });

    room.status = ROOM_STATUS.RENTED;
    room.contractId = contract._id;
    await room.save();

    res.status(201).json({ message: "Tạo hợp đồng thành công", data: contract });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo hợp đồng", error: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const {
      startDate,
      endDate,
      deposit,
      monthlyPrice,
      contractImages,
      notes,
    } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    }

    if (startDate) contract.startDate = startDate;
    if (endDate) contract.endDate = endDate;
    if (deposit != null) contract.deposit = deposit;
    if (monthlyPrice != null) contract.monthlyPrice = monthlyPrice;
    if (contractImages && contractImages.length > 0) contract.contractImages = contractImages;
    if (notes) contract.notes = notes;

    await contract.save();

    res.status(200).json({ message: "Cập nhật hợp đồng thành công", data: contract });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật hợp đồng", error: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    const { contractId } = req.params;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Hợp đồng không tồn tại" });
    }

    const room = await Room.findById(contract.roomId);
    if (room) {
      room.status = ROOM_STATUS.AVAILABLE;
      room.contractId = null;
      await room.save();
    }

    await Contract.findByIdAndDelete(contractId);

    res.status(200).json({ message: "Xóa hợp đồng thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa hợp đồng", error: error.message });
  }
};
