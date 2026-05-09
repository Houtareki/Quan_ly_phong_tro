import Contract from "../models/Contract.js";
import Invoice from "../models/Invoice.js";
import SupportRequest from "../models/SupportRequest.js";
import { CONTRACT_STATUS, ISSUE_TYPE } from "../constants/enums.js";

const DEMO_TENANT_ID = "660000000000000000001101";

const formatResponse = (data, message = "Success") => ({
  message,
  data,
});

const getTenantIdFromRequest = (req) =>
  req.user?._id ||
  req.session?.user?._id ||
  req.query.tenantId ||
  req.get("x-tenant-id") ||
  process.env.DEFAULT_TENANT_ID ||
  DEMO_TENANT_ID;

const findActiveContract = (tenantId) =>
  Contract.findOne({
    tenantId,
    status: CONTRACT_STATUS.ACTIVE,
  })
    .populate("roomId")
    .populate("tenantId", "fullname phone email")
    .sort({ createdAt: -1 });

const findLatestInvoiceRoom = (tenantId) =>
  Invoice.findOne({ tenantId })
    .populate("roomId")
    .populate("tenantId", "fullname phone email")
    .sort({ year: -1, month: -1, createdAt: -1 });

export const getMyRoom = async (req, res) => {
  try {
    const tenantId = getTenantIdFromRequest(req);
    const contract = await findActiveContract(tenantId);

    const latestInvoice = contract?.roomId
      ? null
      : await findLatestInvoiceRoom(tenantId);
    const roomDocument = contract?.roomId || latestInvoice?.roomId;

    if (!roomDocument) {
      return res
        .status(200)
        .json(formatResponse(null, "Chưa có phòng đang thuê"));
    }

    const room = roomDocument.toObject();

    res.status(200).json(
      formatResponse(
        {
          ...room,
          tenantId: contract?.tenantId || latestInvoice?.tenantId,
          contract: contract
            ? {
                _id: contract._id,
                startDate: contract.startDate,
                endDate: contract.endDate,
                deposit: contract.deposit,
                monthlyPrice: contract.monthlyPrice,
                status: contract.status,
              }
            : null,
        },
        "Lấy phòng thành công",
      ),
    );
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin phòng",
      error: error.message,
    });
  }
};

export const getMyInvoices = async (req, res) => {
  try {
    const tenantId = getTenantIdFromRequest(req);

    const invoices = await Invoice.find({ tenantId })
      .populate("roomId", "roomCode roomType")
      .populate("tenantId", "fullname phone")
      .populate("contractId", "startDate endDate status")
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
    const tenantId = getTenantIdFromRequest(req);
    const { content, description, issueType = ISSUE_TYPE.OTHER, roomId } = req.body;
    const requestDescription = description || content;

    if (!requestDescription) {
      return res.status(400).json({
        message: "Nội dung không được để trống",
      });
    }

    const contract = roomId ? null : await findActiveContract(tenantId);
    const supportRoomId = roomId || contract?.roomId?._id;

    if (!supportRoomId) {
      return res.status(404).json({
        message: "Không tìm thấy phòng để gửi yêu cầu hỗ trợ",
      });
    }

    const newRequest = await SupportRequest.create({
      roomId: supportRoomId,
      tenantId,
      issueType,
      description: requestDescription,
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
