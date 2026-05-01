import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import InvoiceListPage from "./pages/invoices/InvoiceListPage";
import CreateInvoicePage from "./pages/invoices/CreateInvoicePage";
import InvoiceDetailPage from "./pages/invoices/InvoiceDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/invoices" replace />} />
      <Route path="/invoices" element={<InvoiceListPage />} />
      <Route path="/invoices/create" element={<CreateInvoicePage />} />
      <Route path="/invoices/:invoiceId" element={<InvoiceDetailPage />} />
    </Routes>
  );
}

export default App;
