import { formatCurrency } from "../../../utils/formatCurrency";

const FinancialSummaryCard = ({ financialSummary }) => (
  <section className="report-card">
    <h6 className="report-card-title">Thu chi tháng này</h6>
    <div className="finance-grid">
      <div>
        <span>Thu</span>
        <strong className="text-success">
          {formatCurrency(financialSummary.totalIncome)}
        </strong>
      </div>
      <div>
        <span>Chi</span>
        <strong className="text-danger">
          {formatCurrency(financialSummary.totalExpense)}
        </strong>
      </div>
      <div>
        <span>Lợi nhuận</span>
        <strong className="text-success">
          {formatCurrency(financialSummary.profit)}
        </strong>
      </div>
    </div>
  </section>
);

export default FinancialSummaryCard;
