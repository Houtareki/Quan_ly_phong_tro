import Invoice from "../models/Invoice.js";
import PaymentTransaction from "../models/PaymentTransaction.js";
import Transaction from "../models/Transaction.js";
import {
  INVOICE_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../constants/enums.js";

import crypto from "crypto";
import qs from "qs";

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

    // Các yêu cầu thanh toán đang chờ sẽ không được tính
    // là đã thanh toán cho đến khi quản trị viên xác nhận.
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

    // VietQR được tạo từ cấu hình ngân hàng tĩnh để chạy demo
    // không thực hiện đối soát ngân hàng thực tế
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

    // Giao dịch được xác nhận khi
    // tiền chính thức được ghi nhận vào lịch sử hóa đơn
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
    await Transaction.create({
      type: "INCOME",
      amount: transaction.amount,
      category: "Thu tiền phòng & dịch vụ",
      roomId: invoice.roomId,
      date: paidAt ? new Date(paidAt) : new Date(),
      description: `Thu tiền hóa đơn tháng ${invoice.month}/${invoice.year} (Duyệt thủ công)`,
    });
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

export const createVNPayUrl = async (req, res) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    const tmnCode = process.env.VNP_TMN_CODE?.trim();
    const secretKey = process.env.VNP_HASH_SECRET?.trim();
    const vnpUrl = process.env.VNP_URL?.trim();
    const returnUrl = process.env.VNP_RETURN_URL?.trim();
    const { amount, invoiceInfo, transactionId } = req.body;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      return res.status(500).json({
        message: "Thiếu cấu hình VNPAY trong backend/.env",
      });
    }

    const paymentAmount = Math.round(Number(amount));
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Số tiền thanh toán không hợp lệ" });
    }

    const date = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const createDate =
      `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
      `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    const orderId = transactionId + Date.now().toString();

    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Mã giao dịch VNPay không hợp lệ" });
    }

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = normalizeVNPayText(
      invoiceInfo || `Thanh toán hóa đơn ${orderId}`,
    );
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = paymentAmount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = normalizeIpAddr(ipAddr);
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    let paymentUrl = vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

    console.log("=== VNPAY DEBUG ===");
    console.log("tmnCode:", tmnCode);
    console.log("signData:", signData);
    console.log("signed:", signed);
    console.log("paymentUrl:", paymentUrl);
    console.log("===================");

    res.status(200).json({ code: "00", paymentUrl });
  } catch (error) {
    console.error("VNPay Error:", error);
    res
      .status(500)
      .json({ message: "Lỗi tạo link VNPay", error: error.message });
  }
};

export const handleVNPayReturn = async (req, res) => {
  try {
    let vnp_Params = { ...req.query };
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET?.trim();
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const responseCode = req.query["vnp_ResponseCode"];
    const vnp_TxnRef = req.query["vnp_TxnRef"];
    const vnp_Amount = parseInt(req.query["vnp_Amount"]) / 100;

    const frontendReturnUrl =
      process.env.FRONTEND_RETURN_URL?.trim() ||
      "http://localhost:5173/user/my-invoices";

    let result = "failed";
    if (secureHash === signed) {
      if (responseCode === "00") {
        result = "success";

        const invoiceId = vnp_TxnRef.substring(0, 24);
        const invoice = await Invoice.findById(invoiceId);

        if (invoice) {
          const isAlreadyPaid = invoice.paymentHistory.some(
            (history) => history.note && history.note.includes(vnp_TxnRef),
          );

          if (!isAlreadyPaid) {
            invoice.paymentHistory.push({
              paidAmount: vnp_Amount,
              paymentMethod: PAYMENT_METHOD.BANK_TRANSFER,
              paidAt: new Date(),
              note: `Thanh toán qua VNPay (Mã GD: ${vnp_TxnRef})`,
            });

            invoice.status = getInvoiceStatus(invoice);
            await invoice.save();

            await Transaction.create({
              type: "INCOME",
              amount: vnp_Amount,
              category: "Thu tiền phòng & dịch vụ",
              roomId: invoice.roomId,
              date: new Date(),
              description: `Thanh toán hóa đơn tháng ${invoice.month}/${invoice.year} qua VNPay`,
            });
          }
        }
      }
    } else {
      result = "invalid_signature";
    }
    res.redirect(
      `${frontendReturnUrl}?vnpay_result=${result}&code=${responseCode || ""}`,
    );
  } catch (error) {
    console.error("VNPay Return Error:", error);
    res.status(500).send("Lỗi xử lý kết quả VNPay");
  }
};

function normalizeVNPayText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9 ._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 255);
}

function normalizeIpAddr(value) {
  const raw = (Array.isArray(value) ? value[0] : String(value || ""))
    .split(",")[0]
    .trim()
    .replace(/^::ffff:/, "");

  if (!raw || raw === "::1") {
    return "127.0.0.1";
  }

  return raw;
}

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
