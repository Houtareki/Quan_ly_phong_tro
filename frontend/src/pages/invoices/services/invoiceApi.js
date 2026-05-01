const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getInvoices = async () => {
  const response = await fetch(`${API_URL}/invoices`);

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách hóa đơn");
  }

  const body = await response.json();

  return body.data.map((invoice) => ({
    id: invoice._id,
    roomName: invoice.roomId?.roomCode || "Không rõ phòng",
    tenantName: invoice.tenantId?.fullname || "Không rõ khách thuê",
    month: invoice.month,
    year: invoice.year,
    totalAmount: invoice.totalAmount,
    status: invoice.status,
  }));
};

export const getActiveContracts = async () => {
  const response = await fetch(`${API_URL}/contracts/active`);

  if (!response.ok) {
    throw new Error("Không thể lấy danh sách hợp đồng");
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
