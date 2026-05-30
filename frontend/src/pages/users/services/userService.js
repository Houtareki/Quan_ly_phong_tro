const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getTenantId = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && user.role === "TENANT") {
        return user._id || user.id;
      }
    } catch (e) {
      console.error("Lỗi đọc thông tin User từ localStorage:", e);
    }
  }
  return (
    localStorage.getItem("tenantId") || import.meta.env.VITE_DEMO_TENANT_ID
  );
};

const getTenantQuery = () => {
  const tenantId = getTenantId();
  return tenantId ? `?tenantId=${encodeURIComponent(tenantId)}` : "";
};

const requestJson = async (path, options) => {
  const res = await fetch(`${API_URL}/user${path}${getTenantQuery()}`, options);
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.message || "Không thể tải dữ liệu");
  }

  return body;
};

export const getMyRoom = () => requestJson("/my-room");

export const getMyInvoices = async (startDate, endDate) => {
  const tenantId = getTenantId();
  const params = new URLSearchParams();
  if (tenantId) params.append("tenantId", tenantId);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const res = await fetch(`${API_URL}/user/my-invoices?${params.toString()}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Không thể tải dữ liệu");
  return body;
};

export const sendSupport = (data) =>
  requestJson("/support", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const getMySupportRequests = () => requestJson("/my-support-requests");
