const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeader = (token) => ({
  Authorization: token ? `Bearer ${token}` : "",
});

export const getRooms = async () => {
  const res = await fetch(`${API_URL}/rooms`);
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không thể lấy danh sách phòng");
  return body.data || [];
};

export const getTenants = async (token) => {
  const res = await fetch(`${API_URL}/user/tenants`, {
    headers: authHeader(token),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không thể lấy danh sách khách thuê");
  return body.data || [];
};

export const createContract = async (token, payload) => {
  const res = await fetch(`${API_URL}/contracts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Tạo hợp đồng thất bại");
  return body.data;
};

export const updateContract = async (token, contractId, payload) => {
  const res = await fetch(`${API_URL}/contracts/${contractId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Cập nhật hợp đồng thất bại");
  return body.data;
};

export const deleteContract = async (token, contractId) => {
  const res = await fetch(`${API_URL}/contracts/${contractId}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Xóa hợp đồng thất bại");
  return body.data;
};

export default { getRooms, getTenants, createContract, updateContract, deleteContract };
