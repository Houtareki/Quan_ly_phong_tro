import { useState } from "react";
import { addPayment } from "../services/invoiceApi";
import { formatCurrency } from "../../../utils/formatCurrency";
import { INVOICE_STATUS, getPaymentButtonLabel } from "../utils/invoiceStatus";
import { useNavigate } from "react-router-dom";

import InvoiceStatusBadge from "./InvoiceStatusBadge";
import "./InvoiceCard.css";

const InvoiceCard = ({ invoice }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(
    invoice.remainingAmount || 0,
  );

  const handleSubmitPayment = async () => {
    const amount = Number(paymentAmount);

    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Số tiền không hợp lệ!");
      return;
    }

    if (amount > invoice.remainingAmount) {
      alert("Số tiền thanh toán không được lớn hơn số nợ còn lại!");
      return;
    }

    try {
      await addPayment(invoice.id, amount);
      alert("Xác nhận thanh toán thành công!");
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      alert(error.message || "Thanh toán thất bại!");
    }
  };

  return (
    <div className="col-12 col-md-6 ">
      <div className="card invoice-card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="fw-bold mb-1">Phòng {invoice.roomName}</h5>
              <p className="text-muted mb-0">
                Tháng {String(invoice.month).padStart(2, "0")}/{invoice.year}
              </p>
            </div>

            <InvoiceStatusBadge status={invoice.status} />
          </div>

          <div className="border-top border-bottom py-3 mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Khách thuê</span>
              <span className="fw-bold">{invoice.tenantName}</span>
            </div>

            {invoice.status === INVOICE_STATUS.PARTIALLY_PAID && (
              <div className="d-flex justify-content-between mt-2">
                <span className="text-danger small">Còn nợ:</span>
                <span className="fw-bold text-danger small">
                  {formatCurrency(invoice.remainingAmount)}
                </span>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between mb-3">
            <span className="text-muted">Tổng tiền</span>
            <span className="fw-bold invoice-total">
              {formatCurrency(invoice.totalAmount)}
            </span>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-light fw-bold"
              onClick={() => navigate(`/invoices/${invoice.id}`)}
            >
              Xem chi tiết
            </button>

            {invoice.status !== INVOICE_STATUS.PAID && (
              <button
                className="btn confirm-paid-btn fw-bold"
                onClick={() => {
                  setPaymentAmount(invoice.remainingAmount);
                  setShowModal(true);
                }}
              >
                {getPaymentButtonLabel(invoice.status)}
              </button>
            )}
          </div>
        </div>

        {showModal && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.95)", zIndex: 10 }}
          >
            <div className="w-100 px-4">
              <h6 className="fw-bold text-success mb-3 text-center">
                Xác nhận thu tiền
              </h6>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  Nhập số tiền khách đã trả (VND)
                </label>
                <input
                  type="number"
                  className="form-control fw-bold text-primary"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  autoFocus
                />
                <div className="form-text" style={{ fontSize: "0.75rem" }}>
                  *Mặc định đã điền sẵn số tiền để trả Full.
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-2">
                <button
                  className="btn btn-light fw-bold w-50"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn btn-success fw-bold w-50 shadow-sm"
                  onClick={handleSubmitPayment}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;
