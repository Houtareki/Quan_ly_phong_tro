const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getDashboardReport = async ({ month, year }) => {
  const response = await fetch(
    `${API_URL}/reports/dashboard?month=${month}&year=${year}`,
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || "Không thể lấy dữ liệu thống kê");
  }

  return body.data;
};
