const API = "http://localhost:5000/api/user";

// Lấy phòng
export const getMyRoom = async () => {
  try {
    const res = await fetch(`${API}/my-room`);

    if (!res.ok) {
      throw new Error("Lỗi lấy phòng");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Lấy hóa đơn
export const getMyInvoices = async () => {
  try {
    const res = await fetch(`${API}/my-invoices`);

    if (!res.ok) {
      throw new Error("Lỗi lấy hóa đơn");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Gửi yêu cầu hỗ trợ
export const sendSupport = async (data) => {
  try {
    const res = await fetch(`${API}/support`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Gửi yêu cầu thất bại");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};