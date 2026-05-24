import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
        onClick={() => navigate("/user/my-invoices")}
      >
        <i className="bi bi-person me-2"></i>Người Thuê
      </button>
    </div>
  );
};

function App() {
  return (
    <>
      <RoleSwitcher />
      <Suspense
        fallback={
          <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ReportsPage />} />
          <Route path="/invoices" element={<InvoiceListPage />} />
          <Route path="/invoices/create" element={<CreateInvoicePage />} />
          <Route path="/invoices/:invoiceId" element={<InvoiceDetailPage />} />
          <Route path="/transactions" element={<TransactionListPage />} />
          <Route
            path="/transactions/create"
            element={<CreateTransactionPage />}
          />
          <Route path="/user" element={<UserAppLayout />}>
            <Route path="my-room" element={<MyRoom />} />
            <Route path="my-invoices" element={<MyInvoices />} />
            <Route
              path="my-invoices/:invoiceId"
              element={<InvoiceDetailPage />}
            />
            <Route path="support" element={<Support />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
