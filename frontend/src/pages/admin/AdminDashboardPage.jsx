import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { getStatsApi } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ icon, label, value, color, bg }) => (
  <div className="col-6 col-lg-3">
    <div className="card border-0 shadow-sm rounded-4 h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <div
          className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
          style={{ width: 48, height: 48, background: bg }}
        >
          <i className={`${icon} fs-5`} style={{ color }}></i>
        </div>
        <div>
          <div className="fw-bold fs-5">{value ?? "—"}</div>
          <div className="text-muted small">{label}</div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatsApi(token);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  return (
    <AppLayout>
      <PageHeader
        title="Dashboard Admin"
        description="Tổng quan hệ thống quản lý phòng trọ"
      />

      {loading && (
        <div className="text-center py-5">
          <span className="spinner-border" style={{ color: "#0f7f5f" }}></span>
        </div>
      )}

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {stats && (
        <>
          {/* Thống kê Users */}
          <h6 className="fw-bold text-muted mb-3 text-uppercase" style={{ fontSize: 12, letterSpacing: 1 }}>
            Người dùng
          </h6>
          <div className="row g-3 mb-4">
            <StatCard icon="bi bi-people-fill" label="Tổng user" value={stats.users.total} color="#0f7f5f" bg="#e9f7f1" />
            <StatCard icon="bi bi-person-badge-fill" label="Admin" value={stats.users.admin} color="#7c3aed" bg="#f3f0ff" />
            <StatCard icon="bi bi-house-fill" label="Chủ trọ" value={stats.users.landlord} color="#d97706" bg="#fef3c7" />
            <StatCard icon="bi bi-person-fill" label="Khách thuê" value={stats.users.tenant} color="#2563eb" bg="#eff6ff" />
          </div>

          {/* Thống kê Phòng */}
          <h6 className="fw-bold text-muted mb-3 text-uppercase" style={{ fontSize: 12, letterSpacing: 1 }}>
            Phòng trọ
          </h6>
          <div className="row g-3 mb-4">
            <StatCard icon="bi bi-house-door-fill" label="Tổng phòng" value={stats.rooms.total} color="#0f7f5f" bg="#e9f7f1" />
            <StatCard icon="bi bi-check-circle-fill" label="Còn trống" value={stats.rooms.available} color="#16a34a" bg="#dcfce7" />
            <StatCard icon="bi bi-key-fill" label="Đã thuê" value={stats.rooms.rented} color="#2563eb" bg="#eff6ff" />
            <StatCard icon="bi bi-clock-fill" label="Chờ duyệt" value={stats.rooms.pendingApproval} color="#d97706" bg="#fef3c7" />
          </div>

          {/* Thống kê Hóa đơn & Doanh thu */}
          <h6 className="fw-bold text-muted mb-3 text-uppercase" style={{ fontSize: 12, letterSpacing: 1 }}>
            Hóa đơn & Doanh thu
          </h6>
          <div className="row g-3 mb-4">
            <StatCard icon="bi bi-receipt-cutoff" label="Tổng hóa đơn" value={stats.invoices.total} color="#0f7f5f" bg="#e9f7f1" />
            <StatCard icon="bi bi-hourglass-split" label="Chưa thanh toán" value={stats.invoices.unpaid} color="#d97706" bg="#fef3c7" />
            <StatCard icon="bi bi-exclamation-triangle-fill" label="Quá hạn" value={stats.invoices.overdue} color="#dc2626" bg="#fee2e2" />
            <StatCard
              icon="bi bi-currency-dollar"
              label="Tổng doanh thu"
              value={stats.revenue.total.toLocaleString("vi-VN") + "đ"}
              color="#16a34a"
              bg="#dcfce7"
            />
          </div>

          {/* Hợp đồng */}
          <div className="row g-3">
            <StatCard icon="bi bi-file-earmark-text-fill" label="Hợp đồng đang hiệu lực" value={stats.contracts.active} color="#7c3aed" bg="#f3f0ff" />
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default AdminDashboardPage;