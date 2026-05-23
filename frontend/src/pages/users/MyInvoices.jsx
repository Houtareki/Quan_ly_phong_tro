import { useEffect, useMemo, useState } from "react";
import { getMyInvoices } from "./services/userService";
import { createVNPayUrl } from "./services/paymentApi";
import InvoiceFilterBar from "../invoices/components/InvoiceFilterBar";
import "./Style.css";

function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Thêm biến Ngày tháng
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // Tách hàm fetchInvoices dùng chung
  const fetchInvoices = () => {
    setLoading(true);
    getMyInvoices(startDate, endDate)
      .then((res) => {
        setInvoices(res.data || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vnpayResult = params.get("vnpay_result");
    const vnpayCode = params.get("code");

    if (vnpayResult) {
      if (vnpayResult === "success") {
        alert("Thanh toán VNPay thành công");
      } else if (vnpayResult === "invalid_signature") {
        alert("Chữ ký VNPay không hợp lệ");
      } else {
        alert(`Thanh toán VNPay thất bại${vnpayCode ? `: ${vnpayCode}` : ""}`);
      }

      window.history.replaceState({}, "", window.location.pathname);
    }

    // Tải dữ liệu lần đầu
    fetchInvoices();
  }, []);

  const handleSearch = () => {
    fetchInvoices();
  };

  const handlePayWithVNPay = async (transactionId, amount) => {
    try {
      const paymentUrl = await createVNPayUrl(transactionId, amount);
      window.location.assign(paymentUrl);
    } catch (error) {
      alert(error.message || "Lỗi kết nối VNPay");
    }
  };

  const filteredInvoices = useMemo(() => {
    if (filter === "ALL") return invoices;
    return invoices.filter((invoice) => invoice.status === filter);
  }, [filter, invoices]);

  return (
    <div className="user-card">
      <InvoiceFilterBar
        filter={filter}
        onFilterChange={setFilter}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onSearch={handleSearch}
      />

      {error && <div className="alert">{error}</div>}
      {loading && <p>Loading...</p>}

      {!loading && filteredInvoices.length === 0 && (
        <div className="empty">
          <div className="icon">🧾</div>
          <p>Không có hóa đơn phù hợp</p>
        </div>
      )}

      {!loading && filteredInvoices.length > 0 && (
        <div className="invoice-user-list">
          {filteredInvoices.map((invoice) => (
            <div
              className="invoice-user-item border-0 shadow-sm rounded-4 p-4 "
              style={{ backgroundColor: "#fff" }}
              key={invoice._id}
            >
              <div>
                <strong>Phòng {invoice.roomId?.roomCode || "N/A"}</strong>
                <p>
                  Tháng {String(invoice.month).padStart(2, "0")}/{invoice.year}
                </p>
              </div>
              <div>
                <strong>
                  {invoice.totalAmount.toLocaleString("vi-VN")} VND
                </strong>
                <p>{invoice.status}</p>
              </div>

              <button
                className={`btn ${invoice.status === "PAID" ? "btn-success" : "btn-primary"}`}
                disabled={invoice.status === "PAID"}
                onClick={() =>
                  handlePayWithVNPay(invoice._id, invoice.totalAmount)
                }
              >
                {invoice.status === "PAID" ? "Đã thanh toán" : "Thanh toán"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyInvoices;
