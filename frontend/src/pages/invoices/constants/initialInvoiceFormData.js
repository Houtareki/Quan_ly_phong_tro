const now = new Date();

export const initialInvoiceFormData = {
  roomId: "",
  month: now.getMonth(),
  year: now.getFullYear(),
  oldElectric: 100,
  newElectric: 111,
  electricPrice: 4000,
  oldWater: 40,
  newWater: 44,
  waterPrice: 15000,
  selectedServices: ["trash", "parking", "wifi"],
};
