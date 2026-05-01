import { electricFields, waterFields } from "../constants/invoiceFormFields";

import PeriodSelector from "./form/PeriodSelector";
import FormAlert from "./form/FormAlert";
import RoomPrice from "./form/RoomPrice";
import RoomSelector from "./form/RoomSelector";

import InvoiceTotal from "./form/InvoiceTotal";
import ServiceFeeSelector from "./form/ServiceFeeSelector";
import UtilityReadingSection from "./form/UtilityReadingSection";

const InvoiceForm = ({ roomOptions, serviceOptions, formState, onCancel }) => {
  const {
    formData,
    errors,
    successMessage,
    submitError,
    isSubmitting,

    selectedRoom,
    electricCost,
    waterCost,
    totalCost,

    handleChange,
    handleServiceChange,
    handleSubmit,
    getInputClass,
    getSelectClass,
  } = formState;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-xl-9">
        <div className="card border-0 shadow-sm rounded-4 invoice-form-card">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <FormAlert
                variant="success"
                iconClass="bi-check-circle-fill"
                message={successMessage}
              />

              <FormAlert
                variant="danger"
                iconClass="bi-exclamation-triangle-fill"
                message={hasErrors ? "Vui lòng sửa các lỗi trong biểu mẫu" : ""}
              />

              <FormAlert
                variant="danger"
                iconClass="bi-exclamation-triangle-fill"
                message={submitError}
              />

              <RoomSelector
                roomOptions={roomOptions}
                roomId={formData.roomId}
                error={errors.roomId}
                onChange={handleChange}
                getSelectClass={getSelectClass}
              />

              <PeriodSelector
                month={formData.month}
                year={formData.year}
                errors={errors}
                onChange={handleChange}
                getInputClass={getInputClass}
                getSelectClass={getSelectClass}
              />

              <RoomPrice roomPrice={selectedRoom?.roomPrice} />

              <UtilityReadingSection
                title="Điện"
                iconClass="bi-lightning-charge-fill"
                iconColorClass="text-warning"
                fields={electricFields}
                estimatedLabel="Tiền điện tạm tính"
                estimatedCost={electricCost}
                formData={formData}
                errors={errors}
                onChange={handleChange}
                getInputClass={getInputClass}
              />

              <UtilityReadingSection
                title="Nước"
                iconClass="bi-droplet-fill"
                iconColorClass="text-primary"
                fields={waterFields}
                estimatedLabel="Tiền nước tạm tính"
                estimatedCost={waterCost}
                formData={formData}
                errors={errors}
                onChange={handleChange}
                getInputClass={getInputClass}
              />

              <ServiceFeeSelector
                serviceOptions={serviceOptions}
                selectedServices={formData.selectedServices}
                onServiceChange={handleServiceChange}
              />

              <InvoiceTotal totalCost={totalCost} />

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn cancel-btn fw-bold"
                  onClick={onCancel}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn save-invoice-btn fw-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
