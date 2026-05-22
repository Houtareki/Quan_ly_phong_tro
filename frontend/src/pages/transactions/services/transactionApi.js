const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createTransaction = async (transaction) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error(body.message || "Không thể tạo giao dịch");
  }

  const body = await response.json();
  return body;
};

export const getTransactions = async (type = "ALL") => {
  const response = await fetch(`${API_URL}/transactions?type=${type}`);

  if (!response.ok) {
    throw new Error(body.message || "Không thể lấy danh sách giao dịch");
  }

  const body = await response.json();
  return body;
};

export const getRoomsList = async () => {
  const response = await fetch(`${API_URL}/rooms`);

  if (!response.ok) {
    throw new Error(body.message || "Không thể lấy danh sách phòng");
  }

  const body = await response.json();
  return body;
};
