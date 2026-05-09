const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getTenantQuery = () => {
  const tenantId =
    localStorage.getItem("tenantId") || import.meta.env.VITE_DEMO_TENANT_ID;

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

export const getMyInvoices = () => requestJson("/my-invoices");

export const sendSupport = (data) =>
  requestJson("/support", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
