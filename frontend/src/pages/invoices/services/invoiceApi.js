const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getInvoices = async (startDate, endDate) => {
  let url = `${API_URL}/invoices`;

  if (startDate || endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể lấy danh sách hóa đơn");
  }

  const body = await response.json();

  return body.data.map((invoice) => ({
    id: invoice._id,
    roomName: invoice.roomId?.roomCode || "Không rõ phòng",
    tenantName: invoice.tenantId?.fullname || "Không rõ khách thuê",
    month: invoice.month,
    year: invoice.year,
    totalAmount: invoice.totalAmount,
    remainingAmount: invoice.remainingAmount,
    status: invoice.status,
  }));
};

export const getInvoiceById = async (invoiceId) => {
  const response = await fetch(`${API_URL}/invoices/${invoiceId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể lấy chi tiết hóa đơn");
  }

  const body = await response.json();

  return body.data;
};

export const getActiveContracts = async () => {
  const response = await fetch(`${API_URL}/contracts/active`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Không thể lấy danh sách hợp đồng");
  }

  const body = await response.json();

  return body.data.map((contract) => ({
    id: contract.roomId?._id,
    contractId: contract._id,
    tenantId: contract.tenantId?._id,
    roomName: contract.roomId?.roomCode,
    tenantName: contract.tenantId?.fullname,
    roomPrice: contract.monthlyPrice || contract.roomId?.defaultPrice || 0,
  }));
};

export const createInvoice = async (payload) => {
  const response = await fetch(`${API_URL}/invoices`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || "Không thể tạo hóa đơn");
  }

  return body.invoice;
};

export const addPayment = async (invoiceId, amount) => {
  const response = await fetch(`${API_URL}/invoices/${invoiceId}/payment`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      paidAmount: amount,
      paymentMethod: "CASH",
      note: "Chủ trọ xác nhận thu tiền thủ công",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Không thể xác nhận thanh toán");
  }
  return response.json();
};

export const getInvoicesByRoomId = async (roomId) => {
  const response = await fetch(`${API_URL}/invoices?roomId=${roomId}`);

  if (!response.ok) return [];

  const body = await response.json();
  return body.data || [];
};
