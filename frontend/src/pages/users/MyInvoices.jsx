import { useEffect, useState } from "react";
import { getMyInvoices } from "../reports/services/userService";
import "./Style.css"

function MyInvoices() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    getMyInvoices().then(res => setInvoices(res.data));
  }, []);

  return (
    <div className="user-card">
      <div className="tabs">
        <button className="active">✓ Tất cả</button>
        <button>Chưa thanh toán</button>
        <button>Đã thanh toán</button>
        <button>Thanh toán một phần</button>
      </div>

      <div className="alert">Failed to fetch</div>

      <div className="empty">
        <div className="icon">🧾</div>
        <p>Không có hóa đơn phù hợp</p>
      </div>
    </div>
  );
}

export default MyInvoices;