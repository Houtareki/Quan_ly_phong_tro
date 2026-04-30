import { formatCurrency } from "../../../utils/formatCurrency";
import { INVOICE_STATUS, getPaymentButtonLabel } from "../utils/invoiceStatus";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import "./InvoiceCard.css";

const InvoiceCard = ({ invoice }) => {
  return (
    <div className="col-12 col-md-6 ">
      <div className="card invoice-card border-0 shadow-sm rounded-4 h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="fw-bold mb-1">{invoice.roomName}</h5>
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
          </div>

          <div className="d-flex justify-content-between">
            <span className="text-muted">Tổng tiền</span>
            <span className="fw-bold invoice-total">
              {formatCurrency(invoice.totalAmount)}
            </span>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-light fw-bold">Xem chi tiết</button>

            {invoice.status !== INVOICE_STATUS.PAID && (
              <button className="btn confirm-paid-btn fw-bold">
                {getPaymentButtonLabel(invoice.status)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
