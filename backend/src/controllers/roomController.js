import { ROOM_STATUS } from "../constants/enums.js";
import Room from "../models/Room.js";

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res
      .status(200)
      .json({ message: "Lấy thông tin phòng thành công", data: rooms });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin phòng", error: error.message });
  }
};
