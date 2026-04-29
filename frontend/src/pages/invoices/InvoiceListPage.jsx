import { useState } from "react";
import "./InvoiceListPage.css";

const sampleInvoices = [
  {
    id: 1,
    roomName: "Phòng 01",
    tenantName: "Nguyễn Văn A",
    month: 3,
    year: 2026,
    totalAmount: 10906888,
    status: "PAID",
  },
  {
    id: 2,
    roomName: "Phòng 05",
    tenantName: "Trần Thị B",
    month: 3,
    year: 2026,
    totalAmount: 1878500,
    status: "UNPAID",
  },
  {
    id: 3,
    roomName: "Phòng 07",
    tenantName: "Lê Văn C",
    month: 3,
    year: 2026,
    totalAmount: 2450000,
    status: "PARTIALLY_PAID",
  },
];

const filterOptions = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chưa thanh toán", value: "UNPAID" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Thanh toán một phần", value: "PARTIALLY_PAID" },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getStatusLabel = (status) => {
  if (status === "PAID") return "Đã thanh toán";
  if (status === "PARTIALLY_PAID") return "Một phần";
  return "Chưa thanh toán";
};

const getStatusClass = (status) => {
  if (status === "PAID") return "status-paid";
  if (status === "PARTIALLY_PAID") return "status-partial";
  return "status-unpaid";
};

const getPaymentButtonLabel = (status) => {
  if (status === "PARTIALLY_PAID") return "Thu thêm";
  return "Xác nhận đã thu";
};

const InvoiceListPage = () => {
  const [filter, setFilter] = useState("ALL");

  const filteredInvoices =
    filter === "ALL"
      ? sampleInvoices
      : sampleInvoices.filter((inv) => inv.status === filter);

  return (
    <div className="container-fluid invoice-page">
      <div className="row min-vh-100">
        <aside className="col-2 col-lg-2 invoice-sidebar p-3">
          <div className="fw-bold fs-4 mb-4 sidebar-brand">QLPT</div>

          <div className="d-flex flex-lg-column gap-2 sidebar-menu">
            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-grid-fill"></i>
              <span>Tổng quan</span>
            </button>

            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-house-door-fill"></i>
              <span>Phòng</span>
            </button>

            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-people-fill"></i>
              <span>Khách thuê</span>
            </button>

            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-receipt-cutoff"></i>
              <span>Hóa đơn</span>
            </button>

            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-wallet2"></i>
              <span>Thu/Chi</span>
            </button>
          </div>
        </aside>

        <main className="col-12 col-lg-10 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1">Quản lý hóa đơn</h2>
              <p className="text-muted mb-0">
                Theo dõi, tạo và xác nhận thanh toán hóa đơn phòng trọ
              </p>
            </div>

            <button className="btn create-invoice-btn fw-bold px-4">
              + Tạo hóa đơn
            </button>
          </div>

          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body d-flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  className={`btn filter-btn ${filter === option.value ? "active" : ""}`}
                  onClick={() => setFilter(option.value)}
                >
                  {filter === option.value && (
                    <i className="bi bi-check-lg me-1"></i>
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-3">
            {filteredInvoices.map((invoice) => (
              <div className="col-12 col-md-6 " key={invoice.id}>
                <div className="card invoice-card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">{invoice.roomName}</h5>
                        <p className="text-muted mb-0">
                          Tháng {String(invoice.month).padStart(2, "0")}/
                          {invoice.year}
                        </p>
                      </div>

                      <span
                        className={`badge rounded-pill status-pill ${getStatusClass(invoice.status)}`}
                      >
                        {getStatusLabel(invoice.status)}
                      </span>
                    </div>

                    <div className="border-top border-bottom py-3 mb-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Khách thuê</span>
                        <span className="fw-bold">{invoice.tenantName}</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Tổng tiền</span>
                      <span className="fw-bold invoice-total">
                        {formatCurrency(invoice.totalAmount)}
                      </span>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-light fw-bold">
                        Xem chi tiết
                      </button>

                      {invoice.status !== "PAID" && (
                        <button className="btn confirm-paid-btn fw-bold">
                          {getPaymentButtonLabel(invoice.status)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoiceListPage;
