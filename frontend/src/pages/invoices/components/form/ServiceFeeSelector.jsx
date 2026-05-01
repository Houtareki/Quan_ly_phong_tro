import { formatCurrency } from "../../../../utils/formatCurrency";

const ServiceFeeSelector = ({
  serviceOptions,
  selectedServices,
  onServiceChange,
  readOnly = false,
}) => {
  return (
    <>
      <div className="section-title mb-3">
        <i className="bi bi-card-checklist text-success me-2"></i>
        Phí dịch vụ
      </div>

      <div className="service-box mb-4">
        {serviceOptions.map((service) => (
          <div className="form-check service-item" key={service.id}>
            <input
              className="form-check-input"
              type="checkbox"
              id={service.id}
              checked={selectedServices.includes(service.id)}
              onChange={() => onServiceChange(service.id)}
              readOnly={readOnly}
            />

            <label className="form-check-label" htmlFor={service.id}>
              <span>{service.name}: </span>
              <strong>{formatCurrency(service.price)}</strong>
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default ServiceFeeSelector;
