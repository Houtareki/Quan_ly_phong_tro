import { formatCurrency } from "../../../utils/formatCurrency";

const InvoiceSummaryCard = ({ invoiceSummary }) => (
  <section className="report-card">
    <h6 className="report-card-title">Hóa đơn</h6>
    <div className="invoice-grid">
      <div>
        <strong className="text-success">{invoiceSummary.paidCount}</strong>
        <span>Đã thanh toán</span>
      </div>
      <div>
        <strong className="text-danger">{invoiceSummary.unpaidCount}</strong>
        <span>Chưa thanh toán</span>
      </div>
    </div>
    <div className="debt-box">
      <span>
        <i className="bi bi-wallet2"></i> Tiền cần thu:
      </span>
      <strong>{formatCurrency(invoiceSummary.totalDebt)}</strong>
    </div>
  </section>
);

export default InvoiceSummaryCard;
