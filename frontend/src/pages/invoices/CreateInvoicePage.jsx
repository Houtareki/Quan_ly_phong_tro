import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InvoiceListPage.css";
import "./CreateInvoicePage.css";

const roomOptions = [
  {
    id: "room-01",
    roomName: "Phòng 01",
    tenantName: "Nguyễn Văn A",
    roomPrice: 560000,
  },
  {
    id: "room-05",
    roomName: "Phòng 05",
    tenantName: "Trần Thị B",
    roomPrice: 750000,
  },
  {
    id: "room-07",
    roomName: "Phòng 07",
    tenantName: "Lê Văn C",
    roomPrice: 900000,
  },
];

const serviceOptions = [
  {
    id: "trash",
    name: "Thu rác",
    price: 20000,
  },
  {
    id: "parking",
    name: "Gửi xe",
    price: 50000,
  },
  {
    id: "wifi",
    name: "Wifi",
    price: 100000,
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const CreateInvoicePage = () => {
  const [formData, setFormData] = useState({
    roomId: "room-01",
    month: 3,
    year: 2026,
    oldElectric: 100,
    newElectric: 111,
    electricPrice: 3500,
    oldWater: 40,
    newWater: 44,
    waterPrice: 15000,
    selectedServices: ["trash", "wifi"],
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const selectedRoom = roomOptions.find((room) => room.id === formData.roomId);

  const selectedServiceFees = serviceOptions.filter((service) =>
    formData.selectedServices.includes(service.id),
  );

  const electricCost =
    Math.max(Number(formData.newElectric) - Number(formData.oldElectric), 0) *
    Number(formData.electricPrice);

  const waterCost =
    Math.max(Number(formData.newWater) - Number(formData.oldWater), 0) *
    Number(formData.waterPrice);

  const serviceCost = selectedServiceFees.reduce(
    (total, service) => total + service.price,
    0,
  );

  const totalCost = useMemo(() => {
    return (
      Number(selectedRoom?.roomPrice || 0) +
      electricCost +
      waterCost +
      serviceCost
    );
  }, [selectedRoom, electricCost, waterCost, serviceCost]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  const handleServiceChange = (serviceId) => {
    setFormData((prev) => {
      const isSelected = prev.selectedServices.includes(serviceId);

      return {
        ...prev,
        selectedServices: isSelected
          ? prev.selectedServices.filter((id) => id !== serviceId)
          : [...prev.selectedServices, serviceId],
      };
    });

    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomId) {
      newErrors.roomId = "Vui lòng chọn phòng";
    }

    if (!formData.month || formData.month < 1 || formData.month > 12) {
      newErrors.month = "Vui lòng nhập tháng hợp lệ (1-12)";
    }

    if (!formData.year || formData.year < 2000) {
      newErrors.year = "Vui lòng nhập năm hợp lệ (>= 2000)";
    }

    if (Number(formData.oldElectric) < 0) {
      newErrors.oldElectric = "Chỉ số điện không được âm";
    }

    if (Number(formData.newElectric) < 0) {
      newErrors.newElectric = "Chỉ số điện không được âm";
    }

    if (Number(formData.oldWater) < 0) {
      newErrors.oldWater = "Chỉ số nước không được âm";
    }

    if (Number(formData.newWater) < 0) {
      newErrors.newWater = "Chỉ số nước không được âm";
    }

    if (Number(formData.oldElectric) > Number(formData.newElectric)) {
      newErrors.newElectric =
        "Chỉ số điện mới phải lớn hơn hoặc bằng chỉ số cũ";
    }

    if (Number(formData.oldWater) > Number(formData.newWater)) {
      newErrors.newWater = "Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số cũ";
    }

    if (Number(formData.electricPrice) < 0) {
      newErrors.electricPrice = "Đơn giá điện không được âm";
    }

    if (Number(formData.waterPrice) < 0) {
      newErrors.waterPrice = "Đơn giá nước không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccessMessage("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setSuccessMessage("Hóa đơn đã được tạo thành công!");

    console.log("Dữ liệu hóa đơn:", {
      contractId: "sau-nay-lay-tu-api-hop-dong",
      roomId: formData.roomId,
      tenantId: "sau-nay-lay-tu-api-hop-dong",
      month: Number(formData.month),
      year: Number(formData.year),
      roomPrice: selectedRoom?.roomPrice || 0,
      utilityReading: {
        oldElectric: Number(formData.oldElectric),
        newElectric: Number(formData.newElectric),
        electricPrice: Number(formData.electricPrice),
        oldWater: Number(formData.oldWater),
        newWater: Number(formData.newWater),
        waterPrice: Number(formData.waterPrice),
      },
      serviceFees: selectedServiceFees.map((service) => ({
        name: service.name,
        price: service.price,
        quantity: 1,
      })),
    });
  };

  const getInputClass = (fieldName) => {
    return `form-control form-control-custom ${errors[fieldName] ? "is-invalid" : ""}`;
  };

  const getSelectClass = (fieldName) => {
    return `form-select form-control-custom ${errors[fieldName] ? "is-invalid" : ""}`;
  };

  return (
    <div className="container-fluid invoice-page">
      <div className="row min-vh-100">
        <aside className="col-2 col-lg-2 invoice-sidebar p-3">
          <div className="fw-bold fs-4 mb-4 sidebar-brand">QLPT</div>

          <div className="d-flex flex-lg-column gap-2 sidebar-menu">
            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-grid-fill"></i>
              <span>Tổng quan</span>
            </button>

            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-house-door-fill"></i>
              <span>Phòng</span>
            </button>

            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-people-fill"></i>
              <span>Khách thuê</span>
            </button>

            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-receipt-cutoff"></i>
              <span>Hóa đơn</span>
            </button>

            <button className="btn sidebar-btn d-flex align-items-center gap-2 w-100">
              <i className="bi bi-wallet2"></i>
              <span>Thu/Chi</span>
            </button>
          </div>
        </aside>

        <main className="col-12 col-lg-10 p-4">
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              type="button"
              className="btn back-btn"
              onClick={() => navigate("/invoices")}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>

          <div className="mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1">Tạo hóa đơn</h2>
              <p className="text-muted mb-0">
                Nhập thông tin điện, nước, phí dịch vụ và tạo hóa đơn tháng
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-xl-9">
              <div className="card border-0 shadow-sm rounded-4 invoice-form-card">
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    {successMessage && (
                      <div className="alert alert-success rounded-4">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        {successMessage}
                      </div>
                    )}

                    {Object.keys(errors).length > 0 && (
                      <div className="alert alert-danger rounded-4">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Vui lòng sửa các lỗi trong biểu mẫu
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="form-label fw-bold">Chọn phòng</label>

                      <select
                        name="roomId"
                        className={getSelectClass("roomId")}
                        value={formData.roomId}
                        onChange={handleChange}
                      >
                        {roomOptions.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.roomName} - {room.tenantName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-bold">Tháng</label>
                        <select
                          className={getSelectClass("month")}
                          name="month"
                          value={formData.month}
                          onChange={handleChange}
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (month) => (
                              <option key={month} value={month}>
                                Tháng {String(month).padStart(2, "0")}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label fw-bold">Năm</label>
                        <input
                          type="number"
                          className={getInputClass("year")}
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                        />
                        {errors.year && (
                          <div className="invalid-feedback">{errors.year}</div>
                        )}
                      </div>
                    </div>

                    <div className="room-price-box mb-4">
                      <div>
                        <span className="text-muted">Tiền phòng</span>
                        <h5 className="fw-bold mb-0">
                          {formatCurrency(selectedRoom?.roomPrice || 0)}
                        </h5>
                      </div>

                      <i className="bi bi-house-check-fill"></i>
                    </div>

                    <div className="section-title mb-3">
                      <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                      Điện
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-12 col-md-4">
                        <label className="form-label">Số điện cũ</label>
                        <input
                          type="number"
                          className={getInputClass("oldElectric")}
                          name="oldElectric"
                          value={formData.oldElectric}
                          onChange={handleChange}
                        />
                        {errors.oldElectric && (
                          <div className="invalid-feedback">
                            {errors.oldElectric}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label">Số điện mới</label>
                        <input
                          type="number"
                          className={getInputClass("newElectric")}
                          name="newElectric"
                          value={formData.newElectric}
                          onChange={handleChange}
                        />
                        {errors.newElectric && (
                          <div className="invalid-feedback">
                            {errors.newElectric}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label">Đơn giá điện</label>
                        <input
                          type="number"
                          className={getInputClass("electricPrice")}
                          name="electricPrice"
                          value={formData.electricPrice}
                          onChange={handleChange}
                        />
                        {errors.electricPrice && (
                          <div className="invalid-feedback">
                            {errors.electricPrice}
                          </div>
                        )}
                      </div>

                      <div className="text-end text-muted mb-4">
                        Tiền điện tạm tính:{" "}
                        <strong>{formatCurrency(electricCost)}</strong>
                      </div>

                      <div className="section-title mb-3">
                        <i className="bi bi-droplet-fill text-primary me-2"></i>
                        Nước
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label">Số nước cũ</label>
                        <input
                          type="number"
                          className={getInputClass("oldWater")}
                          name="oldWater"
                          value={formData.oldWater}
                          onChange={handleChange}
                        />
                        {errors.oldWater && (
                          <div className="invalid-feedback">
                            {errors.oldWater}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label">Số nước mới</label>
                        <input
                          type="number"
                          className={getInputClass("newWater")}
                          name="newWater"
                          value={formData.newWater}
                          onChange={handleChange}
                        />
                        {errors.newWater && (
                          <div className="invalid-feedback">
                            {errors.newWater}
                          </div>
                        )}
                      </div>

                      <div className="col-12 col-md-4">
                        <label className="form-label">Đơn giá nước</label>
                        <input
                          type="number"
                          className={getInputClass("waterPrice")}
                          name="waterPrice"
                          value={formData.waterPrice}
                          onChange={handleChange}
                        />
                        {errors.waterPrice && (
                          <div className="invalid-feedback">
                            {errors.waterPrice}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-end text-muted mb-4">
                      Tiền nước tạm tính:{" "}
                      <strong>{formatCurrency(waterCost)}</strong>
                    </div>

                    <div className="section-title mb-3">
                      <i className="bi bi-card-checklist text-success me-2"></i>
                      Phí dịch vụ
                    </div>

                    <div className="service-box mb-4">
                      {serviceOptions.map((service) => (
                        <div className="form-check service-item">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={service.id}
                            checked={formData.selectedServices.includes(
                              service.id,
                            )}
                            onChange={() => handleServiceChange(service.id)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={service.id}
                          >
                            <span>{service.name}: </span>
                            <strong>{formatCurrency(service.price)}</strong>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="total-box mb-4">
                      <span>Tổng cộng: </span>
                      <strong>{formatCurrency(totalCost)}</strong>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                      <button
                        type="button"
                        className="btn cancel-btn fw-bold"
                        onClick={() => navigate("/invoices")}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="btn save-invoice-btn fw-bold"
                      >
                        Lưu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateInvoicePage;
