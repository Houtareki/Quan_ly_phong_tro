import Room from "../models/Room.js";
import Invoice from "../models/Invoice.js";
import SupportRequest from "../models/SupportRequest.js";

const formatResponse = (data, message = "Success") => ({
  message,
  data,
});

export const getMyRoom = async (req, res) => {
  try {
    const userId = req.user?._id || req.session?.user?._id;

    const room = await Room.findOne({ tenantId: userId });

    if (!room) {
      return res.status(404).json({
        message: "Không tìm thấy phòng của bạn",
      });
    }

    res.status(200).json(formatResponse(room, "Lấy phòng thành công"));
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin phòng",
      error: error.message,
    });
  }
};

export const getMyInvoices = async (req, res) => {
  try {
    const userId = req.user?._id || req.session?.user?._id;

    const invoices = await Invoice.find({ tenantId: userId })
      .populate("roomId", "roomCode roomType")
      .sort({ year: -1, month: -1 });

    res.status(200).json(
      formatResponse(invoices, "Lấy hóa đơn của tôi thành công"),
    );
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy hóa đơn",
      error: error.message,
    });
  }
};
export const createSupportRequest = async (req, res) => {
  try {
    const userId = req.user?._id || req.session?.user?._id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Nội dung không được để trống",
      });
    }

    const newRequest = await SupportRequest.create({
      userId,
      content,
      status: "pending",
    });

    res.status(201).json(
      formatResponse(newRequest, "Gửi yêu cầu thành công"),
    );
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi gửi yêu cầu",
      error: error.message,
    });
  }
};