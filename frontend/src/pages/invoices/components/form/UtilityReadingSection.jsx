import { formatCurrency } from "../../../../utils/formatCurrency";

const UtilityReadingSection = ({
  title,
  iconClass,
  iconColorClass,
  fields,
  estimatedLabel,
  estimatedCost,
  formData,
  errors,
  onChange,
  getInputClass,
}) => {
  return (
    <>
      <div className="section-title mb-3">
        <i className={`bi ${iconClass} ${iconColorClass} me-2`}></i>
        {title}
      </div>

      <div className="row g-3 mb-4">
        {fields.map((field) => (
          <div className="col-12 col-md-4" key={field.name}>
            <label className="form-label">{field.label}</label>
            <input
              type="number"
              className={getInputClass(field.name)}
              name={field.name}
              value={formData[field.name]}
              onChange={onChange}
            />

            {errors[field.name] && (
              <div className="invalid-feedback">{errors[field.name]}</div>
            )}
          </div>
        ))}
      </div>

      <div className="text-end text-muted mb-4">
        {estimatedLabel}: <strong>{formatCurrency(estimatedCost)}</strong>
      </div>
    </>
  );
};

export default UtilityReadingSection;
