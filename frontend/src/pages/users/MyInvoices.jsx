import { useEffect, useMemo, useState } from "react";
import { getMyInvoices } from "./services/userService";
import { createVNPayUrl } from "./services/paymentApi";
import { filterOptions } from "../invoices/utils/invoiceStatus";
import "./Style.css";

function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
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

    getMyInvoices()
      .then((res) => {
        if (mounted) {
          setInvoices(res.data || []);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

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
      <div className="tabs">
        {filterOptions.map((item) => (
          <button
            className={filter === item.value ? "active" : ""}
            key={item.value}
            onClick={() => setFilter(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

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
            <div className="invoice-user-item" key={invoice._id}>
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
