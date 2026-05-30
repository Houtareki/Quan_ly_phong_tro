const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeader = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// ── Thống kê ─────────────────────────────────────────────────
export const getStatsApi = async (token) => {
  const res = await fetch(`${API_URL}/admin/stats`, { headers: authHeader(token) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không lấy được thống kê");
  return body;
};

// ── Quản lý user ─────────────────────────────────────────────
export const getUsersApi = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/admin/users?${query}`, { headers: authHeader(token) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không lấy được danh sách user");
  return body; // { users, pagination }
};

export const getUserByIdApi = async (token, id) => {
  const res = await fetch(`${API_URL}/admin/users/${id}`, { headers: authHeader(token) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không tìm thấy user");
  return body.user;
};

export const updateUserApi = async (token, id, data) => {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: "PUT",
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Cập nhật thất bại");
  return body.user;
};

export const toggleUserActiveApi = async (token, id) => {
  const res = await fetch(`${API_URL}/admin/users/${id}/toggle-active`, {
    method: "PATCH",
    headers: authHeader(token),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Thao tác thất bại");
  return body;
};

export const deleteUserApi = async (token, id) => {
  const res = await fetch(`${API_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Xoá thất bại");
  return body;
};

export const createUserApi = async (token, data) => {
  const res = await fetch(`${API_URL}/admin/users`, {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Tạo user thất bại");
  return body.user;
};

// ── Duyệt phòng ──────────────────────────────────────────────
export const getPendingRoomsApi = async (token, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/admin/rooms/pending?${query}`, { headers: authHeader(token) });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không lấy được danh sách phòng");
  return body; // { rooms, pagination }
};

export const approveRoomApi = async (token, id) => {
  const res = await fetch(`${API_URL}/admin/rooms/${id}/approve`, {
    method: "PATCH",
    headers: authHeader(token),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Duyệt thất bại");
  return body;
};

export const rejectRoomApi = async (token, id, note = "") => {
  const res = await fetch(`${API_URL}/admin/rooms/${id}/reject`, {
    method: "PATCH",
    headers: authHeader(token),
    body: JSON.stringify({ note }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Từ chối thất bại");
  return body;
};

export const getSupportRequestsApi = async (token) => {
  const res = await fetch(`${API_URL}/support/requests`, {
    headers: authHeader(token),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không lấy được yêu cầu hỗ trợ");
  return body;
};

export const markSupportRequestReadApi = async (token, id) => {
  const res = await fetch(`${API_URL}/support/requests/${id}/read`, {
    method: "PATCH",
    headers: authHeader(token),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không thể đánh dấu là đã đọc");
  return body;
};