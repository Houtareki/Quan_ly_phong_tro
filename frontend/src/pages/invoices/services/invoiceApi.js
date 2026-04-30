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
