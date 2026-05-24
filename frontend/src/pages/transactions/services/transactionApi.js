const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createTransaction = async (transaction) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Không thể tạo giao dịch");
  }

  return await response.json();
};

export const getTransactions = async (
  type = "ALL",
  startDate = "",
  endDate = "",
) => {
  let url = `${API_URL}/transactions?type=${type}`;
  if (startDate) {
    url += `&startDate=${startDate}`;
  }
  if (endDate) {
    url += `&endDate=${endDate}`;
  }

  const response = await fetch(url);

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
  return body.data;
};
