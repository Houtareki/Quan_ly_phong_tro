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
