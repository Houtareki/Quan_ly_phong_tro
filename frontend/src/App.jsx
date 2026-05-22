import { Navigate, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ReportsPage />} />
      <Route path="/invoices" element={<InvoiceListPage />} />
      <Route path="/invoices/create" element={<CreateInvoicePage />} />
      <Route path="/invoices/:invoiceId" element={<InvoiceDetailPage />} />
      <Route path="/transactions" element={<TransactionListPage />} />
      <Route path="/transactions/create" element={<CreateTransactionPage />} />
      <Route path="/user" element={<UserAppLayout />}>
        <Route path="my-room" element={<MyRoom />} />
        <Route path="my-invoices" element={<MyInvoices />} />
        <Route path="support" element={<Support />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
