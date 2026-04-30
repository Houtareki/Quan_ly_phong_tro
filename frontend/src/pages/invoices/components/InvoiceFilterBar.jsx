import { filterOptions } from "../utils/invoiceStatus";
import "./InvoiceFilterBar.css";

const InvoiceFilterBar = ({ filter, onFilterChange }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body d-flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`btn filter-btn ${filter === option.value ? "active" : ""}`}
            onClick={() => onFilterChange(option.value)}
          >
            {filter === option.value && <i className="bi bi-check-lg me-1"></i>}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InvoiceFilterBar;
