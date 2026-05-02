import Invoice from "../models/Invoice.js";
import Room from "../models/Room.js";
import Contract from "../models/Contract.js";

import {
  CONTRACT_STATUS,
  INVOICE_STATUS,
  ROOM_STATUS,
} from "../constants/enums.js";

const getPaidAmount = (invoice) =>
  invoice.paymentHistory.reduce(
    (total, payment) => total + payment.paidAmount,
    0,
  );

const getRemainingAmount = (invoice) =>
  Math.max(invoice.totalAmount - getPaidAmount(invoice), 0);

const getMonthRange = (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return { startDate, endDate };
};

const getLastSixMonth = (month, year) => {
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(year, month - 1 - i, 1);

    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      label: `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`,
      revenue: 0,
    });
  }

  return months;
};

const calculateRevenueInRange = (invoices, startDate, endDate) =>
  invoices.reduce((total, invoice) => {
    const paidInRange = invoice.paymentHistory.reduce((sum, payment) => {
      const paidAt = new Date(payment.paidAt);

      if (paidAt >= startDate && paidAt < endDate) {
        return sum + payment.paidAmount;
      }

      return sum;
    }, 0);

    return total + paidInRange;
  }, 0);

export const getDashboardReport = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    const { startDate, endDate } = getMonthRange(month, year);

    const invoicesInMonth = await Invoice.find({ month, year });
    const allInvoices = await Invoice.find();

    const revenueInMonth = calculateRevenueInRange(
      allInvoices,
      startDate,
      endDate,
    );

    const lastSixMonths = getLastSixMonth(month, year);

    lastSixMonths.forEach((item) => {
      const range = getMonthRange(item.month, item.year);
      item.revenue = calculateRevenueInRange(
        allInvoices,
        range.startDate,
        range.endDate,
      );
    });

    const totalRooms = await Room.countDocuments();
    const maintenanceRooms = await Room.countDocuments({
      status: ROOM_STATUS.MAINTENANCE,
    });

    const activeContracts = await Contract.find({
      status: CONTRACT_STATUS.ACTIVE,
    }).distinct("roomId");

    const rentedRooms = activeContracts.length;
    const emptyRooms = Math.max(totalRooms - rentedRooms - maintenanceRooms, 0);
    const occupancyRate =
      totalRooms > 0 ? Math.round((rentedRooms / totalRooms) * 100) : 0;

    const invoiceSummary = invoicesInMonth.reduce(
      (summary, invoice) => {
        const remainingAmount = getRemainingAmount(invoice);

        if (invoice.status === INVOICE_STATUS.PAID) {
          summary.paidCount += 1;
        }

        if (invoice.status === INVOICE_STATUS.UNPAID) {
          summary.unpaidCount += 1;
        }

        if (invoice.status === INVOICE_STATUS.PARTIALLY_PAID) {
          summary.partiallyPaidCount += 1;
        }

        if (invoice.status === INVOICE_STATUS.OVERDUE) {
          summary.overdueCount += 1;
        }

        summary.totalDebt += remainingAmount;

        return summary;
      },
      {
        paidCount: 0,
        unpaidCount: 0,
        partiallyPaidCount: 0,
        overdueCount: 0,
        totalDebt: 0,
      },
    );

    const totalIncome = revenueInMonth;
    const totalExpense = 0;
    const profit = totalIncome - totalExpense;

    res.status(200).json({
      message: "Lấy thống kê dashboard thành công",
      data: {
        month,
        year,
        revenueInMonth,

        roomSummary: {
          totalRooms,
          rentedRooms,
          emptyRooms,
          maintenanceRooms,
          occupancyRate,
        },

        revenueByMonth: lastSixMonths,

        financialSummary: {
          totalIncome,
          totalExpense,
          profit,
        },

        invoiceSummary,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thống kê dashboard",
      error: error.message,
    });
  }
};
