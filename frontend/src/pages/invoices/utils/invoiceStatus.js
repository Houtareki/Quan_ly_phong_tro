export const INVOICE_STATUS = {
  UNPAID: "UNPAID",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
};

export const filterOptions = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chưa thanh toán", value: "UNPAID" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Thanh toán một phần", value: "PARTIALLY_PAID" },
];

export const getStatusLabel = (status) => {
  if (status === "PAID") return "Đã thanh toán";
  if (status === "PARTIALLY_PAID") return "Một phần";
  return "Chưa thanh toán";
};

export const getStatusClass = (status) => {
  if (status === "PAID") return "status-paid";
  if (status === "PARTIALLY_PAID") return "status-partial";
  return "status-unpaid";
};

export const getPaymentButtonLabel = (status) => {
  if (status === "PARTIALLY_PAID") return "Thu thêm";
  return "Xác nhận đã thu";
};
