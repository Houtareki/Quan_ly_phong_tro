import Invoice from "../models/Invoice.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import {
  INVOICE_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../constants/enums.js";

const getPaidAmount = (invoice) =>
  invoice.paymentHistory.reduce(
    (total, payment) => total + payment.paidAmount,
    0,
  );

const getRemainingAmount = (invoice) =>
  Math.max(invoice.totalAmount - getPaidAmount(invoice), 0);

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

const generatePaymentCode = (invoice) => {
  const invoicePart = invoice._id.toString().slice(-6).toUpperCase();
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `PAY-${invoicePart}-${timePart}-${randomPart}`;
};

const getBankConfig = () => ({
  bankCode: process.env.BANK_CODE || "",
  bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
  bankAccountName: process.env.BANK_ACCOUNT_NAME || "",
});

const buildQrUrl = ({
  bankCode,
  bankAccountNumber,
  bankAccountName,
  amount,
  transferContent,
}) => {
  if (!bankCode || !bankAccountNumber) {
    return "";
  }

  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: transferContent,
  });

  if (bankAccountName) {
    params.set("accountName", bankAccountName);
  }

  return `https://img.vietqr.io/image/${encodeURIComponent(
    bankCode,
  )}-${encodeURIComponent(bankAccountNumber)}-compact2.png?${params.toString()}`;
};

const normalizeAmount = (value, fallbackValue) => {
  const amount = value === undefined ? fallbackValue : Number(value);

  return Number.isFinite(amount) ? amount : NaN;
};

const buildPaymentHistoryNote = (transaction, adminNote) => {
  const parts = [`Payment code: ${transaction.paymentCode}`];

  if (transaction.transferContent) {
    parts.push(`Transfer content: ${transaction.transferContent}`);
  }

  if (transaction.note) {
    parts.push(`Tenant note: ${transaction.note}`);
  }

  if (adminNote) {
    parts.push(`Admin note: ${adminNote}`);
  }

  return parts.join(" | ");
};

export const createPaymentRequest = async (req, res) => {
  try {
    const invoiceId =
      req.params.id || req.params.invoiceId || req.body.invoiceId;
    const {
      amount: requestAmount,
      paymentMethod = PAYMENT_METHOD.BANK_TRANSFER,
      note,
    } = req.body;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn!" });
    }

    const remainingAmount = getRemainingAmount(invoice);
    const amount = normalizeAmount(requestAmount, remainingAmount);

    if (remainingAmount <= 0 || invoice.status === INVOICE_STATUS.PAID) {
      return res.status(400).json({ message: "Hóa đơn đã được thanh toán!" });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Số tiền thành toán không hợp lệ!" });
    }

    if (amount > remainingAmount) {
      return res.status(400).json({
        message: "Số tiền thanh toán vượt quá yêu cầu!",
      });
    }

    const pendingTransactions = await PaymentTransaction.find({
      invoiceId: invoice._id,
      status: PAYMENT_STATUS.PENDING,
    });

    const pendingAmount = pendingTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

    if (pendingAmount + amount > remainingAmount) {
      return res.status(400).json({
        message: "Số tiền yêu cầu trả vượt quá mức còn lại!",
      });
    }

    const paymentCode = generatePaymentCode(invoice);
    const transferContent = paymentCode;
    const bankConfig = getBankConfig();
    const qrUrl =
      paymentMethod === PAYMENT_METHOD.BANK_TRANSFER
        ? buildQrUrl({
            ...bankConfig,
            amount,
            transferContent,
          })
        : "";

    const transaction = await PaymentTransaction.create({
      invoiceId: invoice._id,
      contractId: invoice.contractId,
      roomId: invoice.roomId,
      tenantId: invoice.tenantId,
      amount,
      paymentMethod,
      paymentCode,
      transferContent,
      qrUrl,
      ...bankConfig,
      status: PAYMENT_STATUS.PENDING,
      note,
    });

    res.status(201).json({
      message: "Yêu cầu thanh toán đã được tạo!",
      data: transaction,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mã thanh toán đã tồn tại!" });
    }

    res.status(500).json({
      message: "Không thể tạo thanh toán!",
      error: error.message,
    });
  }
};

export const getPaymentTransactions = async (req, res) => {
  try {
    const { status, invoiceId, tenantId, roomId, paymentMethod } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (invoiceId) filter.invoiceId = invoiceId;
    if (tenantId) filter.tenantId = tenantId;
    if (roomId) filter.roomId = roomId;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    const transactions = await PaymentTransaction.find(filter)
      .populate("invoiceId", "month year totalAmount status")
      .populate("roomId", "roomCode roomType")
      .populate("tenantId", "fullname phone")
      .populate("contractId", "startDate endDate status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Lấy danh sách giao dịch thanh toán thành công!",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lấy danh sách giao dịch thanh toán thất bại!",
      error: error.message,
    });
  }
};

export const getPaymentTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await PaymentTransaction.findById(id)
      .populate("invoiceId", "month year totalAmount status paymentHistory")
      .populate("roomId", "roomCode roomType")
      .populate("tenantId", "fullname phone")
      .populate("contractId", "startDate endDate status")
      .populate("confirmedBy", "fullname phone")
      .populate("rejectedBy", "fullname phone");

    if (!transaction) {
      return res.status(404).json({ message: "Payment transaction not found" });
    }

    res.status(200).json({
      message: "Lấy giao dịch thanh toán thành công!",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lấy giao dịch thanh toán thất bại!",
      error: error.message,
    });
  }
};

export const confirmPaymentTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmedBy, adminNote, paidAt } = req.body;

    const transaction = await PaymentTransaction.findById(id);

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giao dịch thanh toán!" });
    }

    if (transaction.status !== PAYMENT_STATUS.PENDING) {
      return res.status(400).json({
        message: "Chỉ có thể xác nhận các giao dịch thanh toán đang chờ xử lý",
      });
    }

    const invoice = await Invoice.findById(transaction.invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Không thấy hóa đơn!" });
    }

    const remainingAmount = getRemainingAmount(invoice);

    if (transaction.amount > remainingAmount) {
      return res.status(400).json({
        message: "Số tiền thanh toán vượt quá số tiền còn lại của hóa đơn",
      });
    }

    invoice.paymentHistory.push({
      paidAmount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      paidAt: paidAt ? new Date(paidAt) : new Date(),
      note: buildPaymentHistoryNote(transaction, adminNote),
    });
    invoice.status = getInvoiceStatus(invoice);

    transaction.status = PAYMENT_STATUS.CONFIRMED;
    transaction.adminNote = adminNote;
    transaction.confirmedBy = confirmedBy;
    transaction.confirmedAt = new Date();

    await invoice.save();
    await transaction.save();

    res.status(200).json({
      message: "Xác nhận giao dịch thanh toán thành công",
      data: {
        transaction,
        invoice,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Xác nhận giao dịch thanh toán thất bại",
      error: error.message,
    });
  }
};

export const rejectPaymentTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectedBy, rejectionReason, adminNote } = req.body;

    const transaction = await PaymentTransaction.findById(id);

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giao dịch thanh toán" });
    }

    if (transaction.status !== PAYMENT_STATUS.PENDING) {
      return res.status(400).json({
        message: "Chỉ có thể từ chối các giao dịch thanh toán đang chờ xử lý",
      });
    }

    transaction.status = PAYMENT_STATUS.REJECTED;
    transaction.rejectedBy = rejectedBy;
    transaction.rejectedAt = new Date();
    transaction.rejectionReason = rejectionReason;
    transaction.adminNote = adminNote;

    await transaction.save();

    res.status(200).json({
      message: "Từ chối giao dịch thanh toán thành công",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Từ chối giao dịch thanh toán thất bại",
      error: error.message,
    });
  }
};
