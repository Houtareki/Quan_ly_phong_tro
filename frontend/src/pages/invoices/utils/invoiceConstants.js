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

export const electricFields = [
  {
    name: "oldElectric",
    label: "Số điện cũ",
  },
  {
    name: "newElectric",
    label: "Số điện mới",
  },
  {
    name: "electricPrice",
    label: "Đơn giá điện",
  },
];

export const waterFields = [
  {
    name: "oldWater",
    label: "Số nước cũ",
  },
  {
    name: "newWater",
    label: "Số nước mới",
  },
  {
    name: "waterPrice",
    label: "Đơn giá nước",
  },
];
