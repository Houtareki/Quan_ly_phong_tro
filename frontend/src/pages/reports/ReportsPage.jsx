import { useEffect, useRef, useState } from "react";
import { getDashboardReport } from "./services/reportApi";
import AppLayout from "../../components/layout/AppLayout";

import ReportHero from "./components/ReportHero";
import RoomSummaryCards from "./components/RoomSummaryCards";
import RevenueChartCard from "./components/RevenueChartCard";
import RoomStatusChart from "./components/RoomStatusChart";
import FinancialSummaryCard from "./components/FinancialSummaryCard";
import InvoiceSummaryCard from "./components/InvoiceSummaryCard";
import OccupancyRateCard from "./components/OccupancyRateCard";
import ExportReportButton from "./components/ExportReportButton";

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

  const reportRef = useRef(null);

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
        <div ref={reportRef} className="report-export-area">
          <ReportHero
            month={month}
            year={year}
            revenueInMonth={report.revenueInMonth}
            onPrevious={goToPreviousMonth}
            onNext={goToNextMonth}
          />
          <RoomSummaryCards roomSummary={report.roomSummary} />
          <div className="report-main-grid mt-3">
            <RevenueChartCard data={report.revenueByMonth} />
            <RoomStatusChart roomSummary={report.roomSummary} />
          </div>
          <div className="report-bottom-grid mt-3">
            <FinancialSummaryCard financialSummary={report.financialSummary} />
            <InvoiceSummaryCard invoiceSummary={report.invoiceSummary} />
            <OccupancyRateCard roomSummary={report.roomSummary} />
          </div>
        </div>
        <ExportReportButton targetRef={reportRef} month={month} year={year} />
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
