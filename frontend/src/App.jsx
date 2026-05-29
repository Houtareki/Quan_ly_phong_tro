import { Navigate, Route, Routes } from "react-router-dom";
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
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const UserDetailPage = lazy(() => import("./pages/admin/UserDetailPage"));
const CreateUserPage = lazy(() => import("./pages/admin/CreateUserPage"));
const RoomApprovalPage = lazy(() => import("./pages/admin/RoomApprovalPage"));

// ── Guards ───────────────────────────────────────────────────
import PrivateRoute from "./components/common/PrivateRoute";
import AdminRoute from "./components/common/AdminRoute";
import LandlordRoute from "./components/common/LandlordRoute";
import TenantRoute from "./components/common/TenantRoute";

const Loader = () => (
  <div className="d-flex align-items-center justify-content-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Đang tải...</span>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ── Auth (public) ── */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Routes ADMIN ── */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
        <Route path="/admin/users/create" element={<AdminRoute><CreateUserPage /></AdminRoute>} />
        <Route path="/admin/users/:id" element={<AdminRoute><UserDetailPage /></AdminRoute>} />
        <Route path="/admin/rooms/approval" element={<AdminRoute><RoomApprovalPage /></AdminRoute>} />
        <Route path="/invoices" element={<AdminRoute><InvoiceListPage /></AdminRoute>} />
        <Route path="/invoices/create" element={<AdminRoute><CreateInvoicePage /></AdminRoute>} />
        <Route path="/invoices/:invoiceId" element={<AdminRoute><InvoiceDetailPage /></AdminRoute>} />
        <Route path="/dashboard" element={<AdminRoute><ReportsPage /></AdminRoute>} />
        <Route path="/transactions" element={<AdminRoute><TransactionListPage /></AdminRoute>} />
        <Route path="/transactions/create" element={<AdminRoute><CreateTransactionPage /></AdminRoute>} />

        {/* ── Routes LANDLORD ── */}
        <Route path="/landlord/dashboard" element={<LandlordRoute><ReportsPage /></LandlordRoute>} />
        <Route path="/landlord/rooms" element={<LandlordRoute><ReportsPage /></LandlordRoute>} />
        <Route path="/landlord/invoices" element={<LandlordRoute><InvoiceListPage /></LandlordRoute>} />

        {/* ── Routes TENANT ── */}
        <Route path="/user" element={<TenantRoute><UserAppLayout /></TenantRoute>}>
          <Route path="my-room" element={<MyRoom />} />
          <Route path="my-invoices" element={<MyInvoices />} />
          <Route path="my-invoices/:invoiceId" element={<InvoiceDetailPage />} />
          <Route path="support" element={<Support />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;