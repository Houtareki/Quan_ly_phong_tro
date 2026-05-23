const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createVNPayUrl = async (transactionId, amount) => {
  const response = await fetch(`${API_URL}/payment-transactions/vnpay-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amount,
      transactionId: transactionId,
      invoiceInfo: "Thanh toan tien phong",
    }),
  });

  const data = await response.json();

  if (!response.ok || data.code !== "00") {
    throw new Error(data.message || "Không thể tạo link thanh toán VNPay");
  }

  return data.paymentUrl;
};
