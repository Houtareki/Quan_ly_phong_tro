import Invoice from "../models/Invoice.js";
import { INVOICE_STATUS } from "../constants/enums.js";

const calculateTotalAmount = ({
  roomPrice = 0,
  utilityReading = {},
  serviceFees = [],
}) => {
  const oldElectric = utilityReading.oldElectric || 0;
  const newElectric = utilityReading.newElectric || 0;
  const electricPrice = utilityReading.electricPrice || 0;

  const oldWater = utilityReading.oldWater || 0;
  const newWater = utilityReading.newWater || 0;
  const waterPrice = utilityReading.waterPrice || 0;

  const electricCost = (newElectric - oldElectric) * electricPrice;
  const waterCost = (newWater - oldWater) * waterPrice;

  const serviceCost = serviceFees.reduce(
    (total, service) => total + service.price * service.quantity,
    0,
  );

  return roomPrice + electricCost + waterCost + serviceCost;
};

const getPaidAmount = (invoice) =>
  (invoice.paymentHistory || []).reduce(
    (total, payment) => total + payment.paidAmount,
    0,
  );

const formatInvoiceResponse = (invoice) => {
  const plainInvoice = invoice.toObject ? invoice.toObject() : invoice;
  const paidAmount = getPaidAmount(plainInvoice);
  const remainingAmount = Math.max(plainInvoice.totalAmount - paidAmount, 0);

  return {
    ...plainInvoice,
    paidAmount,
    remainingAmount,
  };
};

const getInvoiceStatus = (invoice) => {
  const paidAmount = getPaidAmount(invoice);

  if (paidAmount <= 0) {
    return INVOICE_STATUS.UNPAID;
  }

  if (paidAmount < invoice.totalAmount) {
    return INVOICE_STATUS.PARTIALLY_PAID;
  }

  return INVOICE_STATUS.PAID;
};

export const getInvoices = async (req, res) => {
  try {
    const { contractId, tenantId, roomId, month, year, status } = req.query;

    const filter = {};

    if (contractId) filter.contractId = contractId;
    if (tenantId) filter.tenantId = tenantId;
    if (roomId) filter.roomId = roomId;
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);
    if (status) filter.status = status;

    const invoices = await Invoice.find(filter)
      .populate("roomId", "roomCode roomType")
      .populate("tenantId", "fullname phone")
      .populate("contractId", "startDate endDate status");

    const formattedInvoices = invoices.map(formatInvoiceResponse);

    res.status(200).json({
      message: "Lấy hóa đơn thành công",
      data: formattedInvoices,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin hóa đơn", error: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate("roomId", "roomCode roomType")
      .populate("tenantId", "fullname phone")
      .populate("contractId", "startDate endDate status");

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    res.status(200).json({
      message: "Lấy thông tin hóa đơn thành công",
      data: formatInvoiceResponse(invoice),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin hóa đơn", error: error.message });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const {
      contractId,
      roomId,
      tenantId,
      month,
      year,
      dueDate,
      roomPrice,
      utilityReading = {},
      serviceFees = [],
    } = req.body;

    if (utilityReading.oldElectric > utilityReading.newElectric) {
      return res.status(400).json({
        message: "Chỉ số điện mới phải lớn hơn hoặc bằng chỉ số cũ",
      });
    }

    if (utilityReading.oldWater > utilityReading.newWater) {
      return res.status(400).json({
        message: "Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số cũ",
      });
    }

    const normalizedServiceFees = serviceFees.map((service) => ({
      name: service.name,
      price: service.price,
      quantity: service.quantity,
      total: service.price * service.quantity,
    }));

    const totalAmount = calculateTotalAmount({
      roomPrice,
      utilityReading,
      serviceFees: normalizedServiceFees,
    });

    const newInvoice = await Invoice.create({
      contractId,
      roomId,
      tenantId,
      month,
      year,
      dueDate,
      roomPrice,
      utilityReading,
      serviceFees: normalizedServiceFees,
      totalAmount,
      status: INVOICE_STATUS.UNPAID,
      paymentHistory: [],
    });

    if (!dueDate) {
      return res.status(400).json({
        message: "Vui lòng nhập hạn thanh toán",
      });
    }

    res
      .status(201)
      .json({ message: "Tạo hóa đơn thành công", invoice: newInvoice });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Hóa đơn tháng này đã tồn tại cho hợp đồng này",
      });
    }

    res.status(500).json({ message: "Lỗi tạo hóa đơn", error: error.message });
  }
};

export const addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount, paymentMethod, note } = req.body;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    const currentTotalPaid = invoice.paymentHistory.reduce(
      (total, payment) => total + payment.paidAmount,
      0,
    );

    if (currentTotalPaid + paidAmount > invoice.totalAmount) {
      return res.status(400).json({
        message: "Số tiền thanh toán vượt quá tổng số tiền của hóa đơn",
      });
    }

    invoice.paymentHistory.push({
      paidAmount,
      paymentMethod,
      note,
      paidAt: new Date(),
    });

    invoice.status = getInvoiceStatus(invoice);

    await invoice.save();

    res.status(200).json({
      message: "Cập nhật thanh toán thành công",
      data: formatInvoiceResponse(invoice),
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi cập nhật thanh toán",
      error: error.message,
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn để xóa" });
    }

    res
      .status(200)
      .json({ message: "Xóa hóa đơn thành công", data: deletedInvoice });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa hóa đơn", error: error.message });
  }
};
