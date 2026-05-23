import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import InvoiceListPage from "./pages/invoices/InvoiceListPage";
import CreateInvoicePage from "./pages/invoices/CreateInvoicePage";
import InvoiceDetailPage from "./pages/invoices/InvoiceDetailPage";
import ReportsPage from "./pages/reports/ReportsPage";
import TransactionListPage from "./pages/transactions/TransactionListPage";
import CreateTransactionPage from "./pages/transactions/CreateTransactionPage";
import NotFoundPage from "./pages/notFound/NotFoundPage";

import UserAppLayout from "./components/layout/UserAppLayout";
import MyRoom from "./pages/users/MyRoom";
import MyInvoices from "./pages/users/MyInvoices";
import Support from "./pages/users/Support";

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
          <Route path="support" element={<Support />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
