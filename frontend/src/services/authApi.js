const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// POST /api/auth/login
export const loginApi = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Đăng nhập thất bại");
  return body; // { token, user }
};

// POST /api/auth/register
export const registerApi = async (formData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Đăng ký thất bại");
  return body; // { token, user }
};

// GET /api/auth/me
export const getMeApi = async (token) => {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message || "Không lấy được thông tin");
  return body.user;
};