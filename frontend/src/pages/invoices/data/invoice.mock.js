import { INVOICE_STATUS } from "../utils/invoiceStatus";

export const sampleInvoices = [
  {
    id: 1,
    roomName: "Phòng 01",
    tenantName: "Nguyễn Văn A",
    month: 3,
    year: 2026,
    totalAmount: 10906888,
    status: INVOICE_STATUS.PAID,
  },
  {
    id: 2,
    roomName: "Phòng 05",
    tenantName: "Trần Thị B",
    month: 3,
    year: 2026,
    totalAmount: 1878500,
    status: INVOICE_STATUS.UNPAID,
  },
  {
    id: 3,
    roomName: "Phòng 07",
    tenantName: "Lê Văn C",
    month: 3,
    year: 2026,
    totalAmount: 2450000,
    status: INVOICE_STATUS.PARTIALLY_PAID,
  },
];

export const roomOptions = [
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

export const serviceOptions = [
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
