import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AppLayout from "../../components/layout/AppLayout";
import { getDashboardReport } from "../invoices/services/reportApi";
import { formatCurrency } from "../../utils/formatCurrency";
import "./ReportsPage.css";

const ReportsPage = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);

  useEffect(() => {
    getDashboardReport({ month, year })
      .then(setReport)
      .catch((error) => console.error(error));
  }, [month, year]);

  if (!report) {
    return (
      <AppLayout>
        <div className="text-muted">Đang tải thống kê...</div>
      </AppLayout>
    );
  }

  const roomChartData = [
    {
      name: "Phòng trống",
      value: report.roomSummary.emptyRooms,
      color: "#dff3ea",
    },
    {
      name: "Đang thuê",
      value: report.roomSummary.rentedRooms,
      color: "#0f8f68",
    },
    {
      name: "Bảo trì",
      value: report.roomSummary.maintenanceRooms,
      color: "#f59e0b",
    },
  ];

  return (
    <AppLayout>
      <div className="reports-page">
        <div className="reports-title-row">
          <h4 className="fw-bold mb-0">Thống kê</h4>
          <i className="bi bi-grid fs-3 text-muted"></i>
        </div>

        <section className="report-hero">
          <button
            className="month-btn"
            onClick={() => setMonth((m) => (m === 1 ? 12 : m - 1))}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <div>
            <div className="report-month">
              Tháng {String(month).padStart(2, "0")}/{year}
            </div>
            <div className="report-revenue">
              {formatCurrency(report.revenueInMonth)}
            </div>
            <div className="report-caption">Doanh thu trong tháng</div>
          </div>

          <button
            className="month-btn"
            onClick={() => setMonth((m) => (m === 12 ? 1 : m + 1))}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </section>

        <div className="row g-3 mt-1">
          <div className="col-6">
            <div className="report-card metric-card">
              <div className="metric-icon solid"></div>
              <div className="metric-number">
                {report.roomSummary.totalRooms}
              </div>
              <div className="metric-label">Tổng phòng</div>
            </div>
          </div>

          <div className="col-6">
            <div className="report-card metric-card">
              <div className="metric-icon pale">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="metric-number">
                {report.roomSummary.rentedRooms}
              </div>
              <div className="metric-label">Đang thuê</div>
            </div>
          </div>

          <div className="col-6">
            <div className="report-card metric-card">
              <div className="metric-icon warning">
                <i className="bi bi-tools"></i>
              </div>
              <div className="metric-number">
                {report.roomSummary.maintenanceRooms}
              </div>
              <div className="metric-label">Bảo trì</div>
            </div>
          </div>

          <div className="col-6">
            <div className="report-card metric-card">
              <div className="metric-icon empty">
                <i className="bi bi-door-open"></i>
              </div>
              <div className="metric-number">
                {report.roomSummary.emptyRooms}
              </div>
              <div className="metric-label">Phòng trống</div>
            </div>
          </div>
        </div>

        <div className="report-main-grid mt-3">
          <section className="report-card mt-3">
            <h6 className="report-card-title">Doanh thu 6 tháng gần nhất</h6>
            <div className="chart-box large">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={report.revenueByMonth}>
                  <defs>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#0f8f68"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#0f8f68" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#eef2f0" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0f8f68"
                    strokeWidth={3}
                    fill="url(#revenueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="report-card mt-3">
            <h6 className="report-card-title">Tình trạng phòng</h6>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={roomChartData}
                  dataKey="value"
                  innerRadius={78}
                  outerRadius={108}
                  paddingAngle={2}
                >
                  {roomChartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
              <Tooltip />
            </ResponsiveContainer>

            <div className="room-pie-center">
              <strong>{report.roomSummary.totalRooms}</strong>
              <span>phòng</span>
            </div>
          </section>
        </div>

        <section className="report-card mt-3">
          <h6 className="report-card-title">Thu Chi tháng này</h6>
          <div className="finance-grid">
            <div>
              <span>Thu</span>
              <strong className="text-success">
                {formatCurrency(report.financialSummary.totalIncome)}
              </strong>
            </div>
            <div>
              <span>Chi</span>
              <strong className="text-danger">
                {formatCurrency(report.financialSummary.totalExpense)}
              </strong>
            </div>
            <div>
              <span>Lợi nhuận</span>
              <strong className="text-success">
                {formatCurrency(report.financialSummary.profit)}
              </strong>
            </div>
          </div>
        </section>

        <section className="report-card mt-3">
          <h6 className="report-card-title">Hóa đơn</h6>
          <div className="invoice-grid">
            <div>
              <strong className="text-success">
                {report.invoiceSummary.paidCount}
              </strong>
              <span>Đã thanh toán</span>
            </div>
            <div>
              <strong className="text-danger">
                {report.invoiceSummary.unpaidCount}
              </strong>
              <span>Chưa thanh toán</span>
            </div>
          </div>
          <div className="debt-box">
            <span>
              <i className="bi bi-wallet2"></i> Tiền cần thu:
            </span>
            <strong>{formatCurrency(report.invoiceSummary.totalDebt)}</strong>
          </div>
        </section>

        <section className="report-card mt-3">
          <h6 className="report-card-title">Tỷ lệ lấp đầy</h6>
          <div className="progress occupancy-progress">
            <div
              className="progress-bar"
              style={{ width: `${report.roomSummary.occupancyRate}%` }}
            />
          </div>
          <div className="mt-2 text-muted">
            {report.roomSummary.occupancyRate}% (
            {report.roomSummary.rentedRooms}/{report.roomSummary.totalRooms}{" "}
            phòng)
          </div>
        </section>

        <button className="btn export-btn w-100 mt-3 mb-4">
          <i className="bi bi-download me-2"></i>
          Xuất báo cáo PDF
        </button>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
