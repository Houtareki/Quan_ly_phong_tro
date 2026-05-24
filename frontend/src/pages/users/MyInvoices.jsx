import { useNavigate } from "react-router-dom";
import InvoiceStatusBadge from "../invoices/components/InvoiceStatusBadge";
import "../invoices/components/InvoiceCard.css";
import { formatCurrency } from "../../utils/formatCurrency";
import { useEffect, useMemo, useState } from "react";
import { getMyInvoices } from "./services/userService";
import { createVNPayUrl } from "./services/paymentApi";
import InvoiceFilterBar from "../invoices/components/InvoiceFilterBar";
import "./Style.css";

function MyInvoices() {
  const navigate = useNavigate();

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
        <div className="row g-3">
          {filteredInvoices.map((invoice) => (
            <div className="col-12 col-md-6" key={invoice._id}>
              <div className="card invoice-card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">
                        Phòng {invoice.roomId?.roomCode || "N/A"}
                      </h5>
                      <p className="text-muted mb-0">
                        Tháng {String(invoice.month).padStart(2, "0")}/
                        {invoice.year}
                      </p>
                    </div>

                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                  <div className="border-top pt-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Tổng tiền</span>
                      <span
                        className="fw-bold invoice-total"
                        style={{ color: "#28a745", fontSize: "1.1rem" }}
                      >
                        {formatCurrency(invoice.totalAmount)} VND
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-light fw-bold"
                      onClick={() =>
                        navigate(`/user/my-invoices/${invoice._id}`)
                      }
                    >
                      Xem chi tiết
                    </button>
                    {invoice.status !== "PAID" && (
                      <button
                        className="btn btn-success fw-bold shadow-sm"
                        onClick={() =>
                          handlePayWithVNPay(invoice._id, invoice.totalAmount)
                        }
                      >
                        Thanh toán VNPay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyInvoices;
