import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./App.css";

const InvoiceListPage = lazy(() => import("./pages/invoices/InvoiceListPage"));
const CreateInvoicePage = lazy(
  () => import("./pages/invoices/CreateInvoicePage"),
);
const InvoiceDetailPage = lazy(
  () => import("./pages/invoices/InvoiceDetailPage"),
);
const ReportsPage = lazy(() => import("./pages/reports/ReportsPage"));
const TransactionListPage = lazy(
  () => import("./pages/transactions/TransactionListPage"),
);
const CreateTransactionPage = lazy(
  () => import("./pages/transactions/CreateTransactionPage"),
);
const NotFoundPage = lazy(() => import("./pages/notFound/NotFoundPage"));
const UserAppLayout = lazy(() => import("./components/layout/UserAppLayout"));
const MyRoom = lazy(() => import("./pages/users/MyRoom"));
const MyInvoices = lazy(() => import("./pages/users/MyInvoices"));
const Support = lazy(() => import("./pages/users/Support"));

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const UserDetailPage = lazy(() => import("./pages/admin/UserDetailPage"));
const CreateUserPage = lazy(() => import("./pages/admin/CreateUserPage"));
const RoomApprovalPage = lazy(() => import("./pages/admin/RoomApprovalPage"));
const DebugUsersPage = lazy(() => import("./pages/auth/DebugUsersPage"));

import PrivateRoute from "./components/common/PrivateRoute";
import AdminRoute from "./components/common/AdminRoute";
import TenantRoute from "./components/common/TenantRoute";
import { useAuth } from "./context/AuthContext";

const Loader = () => (
  <div className="d-flex align-items-center justify-content-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Đang tải...</span>
    </div>
  </div>
);

const ManagementRoute = ({ children }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN" && user?.role !== "LANDLORD") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ── Auth (public) ── */}
        <Route path="/debug-users" element={<DebugUsersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Routes chỉ dành cho ADMIN ── */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/create"
          element={
            <AdminRoute>
              <CreateUserPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminRoute>
              <UserDetailPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/approval"
          element={
            <AdminRoute>
              <RoomApprovalPage />
            </AdminRoute>
          }
        />

        {/* ── Routes dành cho cả ADMIN & LANDLORD (ManagementRoute) ── */}
        <Route
          path="/dashboard"
          element={
            <ManagementRoute>
              <ReportsPage />
            </ManagementRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ManagementRoute>
              <InvoiceListPage />
            </ManagementRoute>
          }
        />
        <Route
          path="/invoices/create"
          element={
            <ManagementRoute>
              <CreateInvoicePage />
            </ManagementRoute>
          }
        />
        <Route
          path="/invoices/:invoiceId"
          element={
            <ManagementRoute>
              <InvoiceDetailPage />
            </ManagementRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ManagementRoute>
              <TransactionListPage />
            </ManagementRoute>
          }
        />
        <Route
          path="/transactions/create"
          element={
            <ManagementRoute>
              <CreateTransactionPage />
            </ManagementRoute>
          }
        />

        {/* ── Routes dành cho KHÁCH THUÊ (TENANT) ── */}
        <Route
          path="/user"
          element={
            <TenantRoute>
              <UserAppLayout />
            </TenantRoute>
          }
        >
          <Route path="/user/my-room" element={<MyRoom />} />
          <Route path="/user/my-invoices" element={<MyInvoices />} />
          <Route
            path="/user/my-invoices/:invoiceId"
            element={<InvoiceDetailPage />}
          />
          <Route path="/user/support" element={<Support />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
