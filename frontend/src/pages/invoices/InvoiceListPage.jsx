import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import InvoiceCard from "../invoices/components/InvoiceCard";
import InvoiceFilterBar from "./components/InvoiceFilterBar";
import { sampleInvoices } from "./data/invoice.mock";
import { useInvoiceFilter } from "./hooks/useInvoiceFilter";
import "./InvoiceListPage.css";

const InvoiceListPage = () => {
  const navigate = useNavigate();

  const { filter, setFilter, filteredInvoices } =
    useInvoiceFilter(sampleInvoices);

  return (
    <AppLayout>
      <PageHeader
        title="Quản lý hóa đơn"
        description="Theo dõi, tạo và xác nhận thanh toán hóa đơn phòng trọ"
        action={
          <button
            type="button"
            className="btn create-invoice-btn fw-bold px-4"
            onClick={() => navigate("/invoices/create")}
          >
            + Tạo hóa đơn
          </button>
        }
      />

      <InvoiceFilterBar filter={filter} onFilterChange={setFilter} />

      <div className="row g-3">
        {filteredInvoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}

        {filteredInvoices.length === 0 && (
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body text-center py-5">
                <i className="bi bi-receipt fs-1 text-muted"></i>
                <h5 className="fw-bold mt-3">Không có hóa đơn phù hợp</h5>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default InvoiceListPage;
