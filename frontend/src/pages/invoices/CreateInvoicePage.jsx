import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { serviceOptions } from "./data/invoice.mock";
import { useCreateInvoiceForm } from "./hooks/useCreateInvoiceForm";
import { getActiveContracts } from "./services/invoiceApi";

import AppLayout from "../../components/layout/AppLayout";
import InvoiceForm from "./components/InvoiceForm";

import "./InvoiceListPage.css";
import "./CreateInvoicePage.css";

const CreateInvoicePage = () => {
  const [roomOptions, setRoomOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      const rooms = await getActiveContracts();
      setRoomOptions(rooms);
    };

    fetchContracts();
  }, []);

  const formState = useCreateInvoiceForm(roomOptions, serviceOptions);

  return (
    <AppLayout>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          type="button"
          className="btn back-btn"
          onClick={() => navigate("/invoices")}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
      </div>

      <div className="mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">Tạo hóa đơn</h2>
          <p className="text-muted mb-0">
            Nhập thông tin điện, nước, phí dịch vụ và tạo hóa đơn tháng
          </p>
        </div>
      </div>

      <InvoiceForm
        roomOptions={roomOptions}
        serviceOptions={serviceOptions}
        formState={formState}
        onCancel={() => navigate("/invoices")}
      />
    </AppLayout>
  );
};

export default CreateInvoicePage;
