export const INVOICE_STATUS = {
  UNPAID: "UNPAID",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
};

export const filterOptions = [
  { label: "Tất cả", value: "ALL" },
  { label: "Chưa thanh toán", value: "UNPAID" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Thanh toán một phần", value: "PARTIALLY_PAID" },
];

export const getStatusLabel = (status) => {
  if (status === "PAID") return "Đã thanh toán";
  if (status === "PARTIALLY_PAID") return "Một phần";
  return "Chưa thanh toán";
};

export const getStatusClass = (status) => {
  if (status === "PAID") return "status-paid";
  if (status === "PARTIALLY_PAID") return "status-partial";
  return "status-unpaid";
};

export const getPaymentButtonLabel = (status) => {
  if (status === "PARTIALLY_PAID") return "Thu thêm";
  return "Xác nhận đã thu";
};

export const calculateElectricCost = (
  oldElectric,
  newElectric,
  electricPrice,
) => {
  const usedElectric = Math.max(Number(newElectric) - Number(oldElectric), 0);
  return usedElectric * Number(electricPrice || 0);
};

export const calculateWaterCost = (oldWater, newWater, waterPrice) => {
  const usedWater = Math.max(Number(newWater) - Number(oldWater), 0);
  return usedWater * Number(waterPrice || 0);
};

export const calculateServiceCost = (services = [], quantities = {}) => {
  return services.reduce((total, service) => {
    const quantity = quantities[service.id] || 1;
    return total + Number(service.price || 0) * Number(quantity);
  }, 0);
};

export const calculateInvoiceTotal = (
  roomPrice = 0,
  electricCost = 0,
  waterCost = 0,
  serviceCost = 0,
) => {
  return (
    Number(roomPrice || 0) +
    Number(electricCost || 0) +
    Number(waterCost || 0) +
    Number(serviceCost || 0)
  );
};

export const buildInvoicePayload = (
  formData,
  selectedRoom,
  selectedServiceFees,
) => {
  return {
    contractId: selectedRoom.contractId,
    roomId: selectedRoom.id,
    tenantId: selectedRoom.tenantId,

    month: Number(formData.month),
    year: Number(formData.year),
    dueDate: formData.dueDate,
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
      quantity: Number(service.quantity || 1),
    })),
  };
};

export const validateForm = (formData) => {
  const errors = {};

  if (!formData.roomId) {
    errors.roomId = "Vui lòng chọn phòng";
  }

  if (!formData.month || formData.month < 1 || formData.month > 12) {
    errors.month = "Vui lòng nhập tháng hợp lệ (1-12)";
  }

  if (!formData.year || formData.year < 2000) {
    errors.year = "Vui lòng nhập năm hợp lệ (>= 2000)";
  }

  if (Number(formData.oldElectric) < 0) {
    errors.oldElectric = "Chỉ số điện không được âm";
  }

  if (Number(formData.newElectric) < 0) {
    errors.newElectric = "Chỉ số điện không được âm";
  }

  if (Number(formData.oldWater) < 0) {
    errors.oldWater = "Chỉ số nước không được âm";
  }

  if (Number(formData.newWater) < 0) {
    errors.newWater = "Chỉ số nước không được âm";
  }

  if (Number(formData.oldElectric) > Number(formData.newElectric)) {
    errors.newElectric = "Chỉ số điện mới phải lớn hơn hoặc bằng chỉ số cũ";
  }

  if (Number(formData.oldWater) > Number(formData.newWater)) {
    errors.newWater = "Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số cũ";
  }

  if (Number(formData.electricPrice) < 0) {
    errors.electricPrice = "Đơn giá điện không được âm";
  }

  if (Number(formData.waterPrice) < 0) {
    errors.waterPrice = "Đơn giá nước không được âm";
  }

  return errors;
};
