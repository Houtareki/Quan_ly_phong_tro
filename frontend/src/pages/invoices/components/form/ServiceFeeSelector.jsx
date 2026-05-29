import { formatCurrency } from "../../../../utils/formatCurrency";

const ServiceFeeSelector = ({
  serviceOptions,
  selectedServices,
  serviceQuantities = {},
  onServiceChange,
  onServiceQuantityChange,
  readOnly = false,
}) => {
  return (
    <>
      <div className="section-title mb-3">
        <i className="bi bi-card-checklist text-success me-2"></i>
        Phí dịch vụ
      </div>

      <div className="service-box mb-4 p-3 bg-light rounded-3">
        {serviceOptions.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          const quantity = serviceQuantities[service.id] || 1;

          return (
            <div
              className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2"
              key={service.id}
            >
              <div className="form-check service-item mb-0 d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={service.id}
                  checked={isSelected}
                  onChange={() => onServiceChange(service.id)}
                  disabled={readOnly}
                />
                <label
                  className="form-check-label ms-2 cursor-pointer"
                  htmlFor={service.id}
                >
                  <span className="fw-semibold">{service.name}: </span>
                  <span className="text-success fw-bold">
                    {formatCurrency(service.price)}
                  </span>
                </label>
              </div>

              {isSelected && !readOnly && (
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted text-nowrap">
                    Số lượng:
                  </span>
                  <input
                    type="number"
                    min="1"
                    className="form-control form-control-sm text-center"
                    style={{ width: "70px", borderRadius: "8px" }}
                    value={quantity}
                    onChange={(e) =>
                      onServiceQuantityChange(
                        service.id,
                        parseInt(e.target.value) || 1,
                      )
                    }
                  />
                </div>
              )}

              {isSelected && readOnly && (
                <span className="badge bg-secondary">SL: {quantity}</span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ServiceFeeSelector;
