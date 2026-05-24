import { filterOptions } from "../utils/invoiceStatus";
import "./InvoiceFilterBar.css";

const InvoiceFilterBar = ({
  filter,
  onFilterChange,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onSearch,
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
      {/* Tab lọc */}
      <div className="card border-0 shadow-sm rounded-4 m-0">
        <div className="card-body d-flex flex-wrap gap-2 p-2">
          {filterOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`btn filter-btn ${filter === option.value ? "active" : ""}`}
              onClick={() => onFilterChange(option.value)}
            >
              {filter === option.value && (
                <i className="bi bi-check-lg me-1"></i>
              )}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lịch Chọn Ngày */}
      <div className="d-flex align-items-center gap-2 bg-light p-2 rounded-4 shadow-sm border">
        <i className="bi bi-calendar-range text-muted ms-2"></i>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small fw-bold ms-1">Từ:</span>
          <input
            type="date"
            className="form-control form-control-sm border-0 bg-transparent text-dark"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="vr text-muted"></div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small fw-bold">Đến:</span>
          <input
            type="date"
            className="form-control form-control-sm border-0 bg-transparent text-dark pe-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          className="btn btn-success btn-sm rounded-pill px-3 ms-2 fw-bold shadow-sm"
          onClick={onSearch}
        >
          <i className="bi bi-search me-1"></i> Tìm
        </button>
      </div>
    </div>
  );
};

export default InvoiceFilterBar;
