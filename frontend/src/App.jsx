import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";

// ── Lazy imports của team ────────────────────────────────────
const InvoiceListPage = lazy(() => import("./pages/invoices/InvoiceListPage"));
const CreateInvoicePage = lazy(() => import("./pages/invoices/CreateInvoicePage"));
const InvoiceDetailPage = lazy(() => import("./pages/invoices/InvoiceDetailPage"));
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));
const TransactionListPage = lazy(() => import("./pages/transactions/TransactionListPage"));
const CreateTransactionPage = lazy(() => import("./pages/transactions/CreateTransactionPage"));
const NotFoundPage = lazy(() => import("./pages/notFound/NotFoundPage"));
const UserAppLayout = lazy(() => import("./components/layout/UserAppLayout"));
const MyRoom = lazy(() => import("./pages/users/MyRoom"));
const MyInvoices = lazy(() => import("./pages/users/MyInvoices"));
const Support = lazy(() => import("./pages/users/Support"));

// ── Lazy imports của admin/auth ──────────────────────────────
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const UserDetailPage = lazy(() => import("./pages/admin/UserDetailPage"));
const CreateUserPage = lazy(() => import("./pages/admin/CreateUserPage"));
const RoomApprovalPage = lazy(() => import("./pages/admin/RoomApprovalPage"));

// ── Guards ───────────────────────────────────────────────────
import PrivateRoute from "./components/common/PrivateRoute";
import AdminRoute from "./components/common/AdminRoute";

// Nút test tạm của team (giữ lại để team test)
const RoleSwitcher = () => {
  const navigate = useNavigate();
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
      <button
        className="btn btn-warning shadow rounded-pill fw-bold"
        onClick={() => navigate("/dashboard")}
      >
        <i className="bi bi-person-badge me-2"></i>Chủ Trọ
      </button>
      <button
        className="btn btn-info shadow rounded-pill fw-bold ms-2"
        onClick={() => navigate("/user/my-room")}
      >
        <i className="bi bi-person me-2"></i>Người Thuê
      </button>
    </div>
  );
};

const Loader = () => (
  <div className="d-flex align-items-center justify-content-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Đang tải...</span>
    </div>
  </div>
);

function App() {
  return (
    <>
      <RoleSwitcher />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ── Auth (public) ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Redirect gốc → login ── */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ── Routes cần đăng nhập ── */}
          <Route path="/dashboard" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
          <Route path="/invoices" element={<PrivateRoute><InvoiceListPage /></PrivateRoute>} />
          <Route path="/invoices/create" element={<PrivateRoute><CreateInvoicePage /></PrivateRoute>} />
          <Route path="/invoices/:invoiceId" element={<PrivateRoute><InvoiceDetailPage /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><TransactionListPage /></PrivateRoute>} />
          <Route path="/transactions/create" element={<PrivateRoute><CreateTransactionPage /></PrivateRoute>} />

          {/* ── Routes khách thuê ── */}
          <Route path="/user" element={<PrivateRoute><UserAppLayout /></PrivateRoute>}>
            <Route path="my-room" element={<MyRoom />} />
            <Route path="my-invoices" element={<MyInvoices />} />
            <Route path="my-invoices/:invoiceId" element={<InvoiceDetailPage />} />
            <Route path="support" element={<Support />} />
          </Route>

          {/* ── Routes admin ── */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path="/admin/users/create" element={<AdminRoute><CreateUserPage /></AdminRoute>} />
          <Route path="/admin/users/:id" element={<AdminRoute><UserDetailPage /></AdminRoute>} />
          <Route path="/admin/rooms/approval" element={<AdminRoute><RoomApprovalPage /></AdminRoute>} />

          {/* ── Fallback ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;