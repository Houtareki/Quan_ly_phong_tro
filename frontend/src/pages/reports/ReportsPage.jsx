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
import { formatCurrency } from "../../utils/formatCurrency";
import { getDashboardReport } from "../invoices/services/reportApi";
import "./ReportsPage.css";

const getCurrentPeriod = () => {
  const now = new Date();

  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
};

const ReportsPage = () => {
  const currentPeriod = getCurrentPeriod();
  const [month, setMonth] = useState(currentPeriod.month);
  const [year, setYear] = useState(currentPeriod.year);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getDashboardReport({ month, year });
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [month, year]);

  const goToPreviousMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((currentYear) => currentYear - 1);
      return;
    }

    setMonth((currentMonth) => currentMonth - 1);
  };

  const goToNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((currentYear) => currentYear + 1);
      return;
    }

    setMonth((currentMonth) => currentMonth + 1);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-muted">Đang tải thống kê...</div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="alert alert-danger">{error}</div>
      </AppLayout>
    );
  }

  if (!report) {
    return (
      <AppLayout>
        <div className="text-muted">Không có dữ liệu thống kê.</div>
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
          <div>
            <h4 className="fw-bold mb-1">Thống kê</h4>
            <p className="reports-subtitle mb-0">
              Tổng quan doanh thu, hóa đơn và tình trạng phòng trọ
            </p>
          </div>
          <i className="bi bi-grid fs-3 text-muted"></i>
        </div>

        <section className="report-hero">
          <button
            type="button"
            className="month-btn"
            onClick={goToPreviousMonth}
            aria-label="Tháng trước"
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
            type="button"
            className="month-btn"
            onClick={goToNextMonth}
            aria-label="Tháng sau"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </section>

        <div className="report-summary-grid mt-3">
          <div className="report-card metric-card">
            <div className="metric-icon solid">
              <i className="bi bi-house-door-fill"></i>
            </div>
            <div className="metric-number">{report.roomSummary.totalRooms}</div>
            <div className="metric-label">Tổng phòng</div>
          </div>

          <div className="report-card metric-card">
            <div className="metric-icon pale">
              <i className="bi bi-people-fill"></i>
            </div>
            <div className="metric-number">{report.roomSummary.rentedRooms}</div>
            <div className="metric-label">Đang thuê</div>
          </div>

          <div className="report-card metric-card">
            <div className="metric-icon warning">
              <i className="bi bi-tools"></i>
            </div>
            <div className="metric-number">
              {report.roomSummary.maintenanceRooms}
            </div>
            <div className="metric-label">Bảo trì</div>
          </div>

          <div className="report-card metric-card">
            <div className="metric-icon empty">
              <i className="bi bi-door-open"></i>
            </div>
            <div className="metric-number">{report.roomSummary.emptyRooms}</div>
            <div className="metric-label">Phòng trống</div>
          </div>
        </div>

        <div className="report-main-grid mt-3">
          <section className="report-card">
            <h6 className="report-card-title">Doanh thu 6 tháng gần nhất</h6>
            <div className="chart-box large">
              <ResponsiveContainer width="100%" height="100%">
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

          <section className="report-card">
            <h6 className="report-card-title">Tình trạng phòng</h6>

            <div className="room-pie-wrap">
              <ResponsiveContainer width="100%" height="100%">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="room-pie-center">
                <strong>{report.roomSummary.totalRooms}</strong>
                <span>phòng</span>
              </div>
            </div>

            <div className="room-status-legend">
              {roomChartData.map((item) => (
                <div className="legend-item" key={item.name}>
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="report-bottom-grid mt-3">
          <section className="report-card">
            <h6 className="report-card-title">Thu chi tháng này</h6>
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

          <section className="report-card">
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

          <section className="report-card">
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
        </div>

        <button className="btn export-btn w-100 mt-3 mb-4">
          <i className="bi bi-download me-2"></i>
          Xuất báo cáo PDF
        </button>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
