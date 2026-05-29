const now = new Date();

const next7Days = new Date(now);
next7Days.setDate(now.getDate() + 7);

export const initialInvoiceFormData = {
  roomId: "",
  month: now.getMonth() + 1,
  year: now.getFullYear(),
  dueDate: next7Days.toISOString().split("T")[0],
  oldElectric: 100,
  newElectric: 111,
  electricPrice: 4000,
  oldWater: 40,
  newWater: 44,
  waterPrice: 15000,
  selectedServices: ["trash", "parking", "wifi"],
  serviceQuantities: {},
};
