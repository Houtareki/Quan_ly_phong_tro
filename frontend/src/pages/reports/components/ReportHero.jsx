import { formatCurrency } from "../../../utils/formatCurrency";

const ReportHero = ({ month, year, revenueInMonth, onPrevious, onNext }) => {
  return (
    <section className="report-hero">
      <button
        type="button"
        className="month-btn"
        onClick={onPrevious}
        aria-label="Tháng trước"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      <div>
        <div className="report-month">
          Tháng {String(month).padStart(2, "0")}/{year}
        </div>
        <div className="report-revenue">{formatCurrency(revenueInMonth)}</div>
        <div className="report-caption">Doanh thu trong tháng</div>
      </div>

      <button
        type="button"
        className="month-btn"
        onClick={onNext}
        aria-label="Tháng sau"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </section>
  );
};

export default ReportHero;
