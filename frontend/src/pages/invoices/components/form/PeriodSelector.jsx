const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

const PeriodSelector = ({
  month,
  year,
  errors,
  onChange,
  getInputClass,
  getSelectClass,
}) => {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-6">
        <label className="form-label fw-bold">Tháng</label>
        <select
          className={getSelectClass("month")}
          name="month"
          value={month}
          onChange={onChange}
        >
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              Tháng {String(month).padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md-6">
        <label className="form-label fw-bold">Năm</label>
        <input
          type="number"
          className={getInputClass("year")}
          name="year"
          value={year}
          onChange={onChange}
        />
        {errors.year && <div className="invalid-feedback">{errors.year}</div>}
      </div>
    </div>
  );
};

export default PeriodSelector;
