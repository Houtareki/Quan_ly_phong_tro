import { useEffect, useState } from "react";
import { getInvoices } from "./services/invoiceApi";
import { useNavigate } from "react-router-dom";
import { useInvoiceFilter } from "./hooks/useInvoiceFilter";

import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import InvoiceCard from "../invoices/components/InvoiceCard";
import InvoiceFilterBar from "./components/InvoiceFilterBar";
import "./InvoiceListPage.css";

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const navigate = useNavigate();

  const { filter, setFilter, filteredInvoices } = useInvoiceFilter(invoices);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

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

      <InvoiceFilterBar filter={filter} onFilterChange={handleFilterChange} />

      {loading && <div className="text-muted">Đang tải hóa đơn...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3">
        {currentInvoices.map((invoice) => (
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

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination shadow-sm">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link text-success"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Trang trước
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button
                  className={`page-link ${currentPage === index + 1 ? "bg-success border-success text-white" : "text-success"}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link text-success"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Trang tiếp
              </button>
            </li>
          </ul>
        </div>
      )}
    </AppLayout>
  );
};

export default InvoiceListPage;
