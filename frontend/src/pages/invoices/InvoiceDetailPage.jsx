import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInvoiceById } from "./services/invoiceApi";
import { electricFields, waterFields } from "./constants/invoiceFormFields";
import {
  calculateElectricCost,
  calculateWaterCost,
} from "./utils/invoiceCalculation";

import AppLayout from "../../components/layout/AppLayout";
import InvoiceStatusBadge from "./components/InvoiceStatusBadge";
import RoomPrice from "./components/form/RoomPrice";
import UtilityReadingSection from "./components/form/UtilityReadingSection";
import ServiceFeeSelector from "./components/form/ServiceFeeSelector";
import InvoiceTotal from "./components/form/InvoiceTotal";

import "./CreateInvoicePage.css";

const InvoiceDetailPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceById(invoiceId);
        setInvoice(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) return <AppLayout>Đang tải hóa đơn...</AppLayout>;
  if (error)
    return (
      <AppLayout>
        <div className="alert alert-danger">{error}</div>
      </AppLayout>
    );
  if (!invoice) return null;

  const detailFormData = {
    oldElectric: invoice.utilityReading?.oldElectric || 0,
    newElectric: invoice.utilityReading?.newElectric || 0,
    electricPrice: invoice.utilityReading?.electricPrice || 0,

    oldWater: invoice.utilityReading?.oldWater || 0,
    newWater: invoice.utilityReading?.newWater || 0,
    waterPrice: invoice.utilityReading?.waterPrice || 0,
  };

  const serviceOptions = invoice.serviceFees.map((service, index) => ({
    id: String(index),
    name: service.name,
    price: service.total || service.price * service.quantity,
  }));
  const selectedServices = serviceOptions.map((service) => service.id);

  const electricCost = calculateElectricCost(
    detailFormData.oldElectric,
    detailFormData.newElectric,
    detailFormData.electricPrice,
  );

  const waterCost = calculateWaterCost(
    detailFormData.oldWater,
    detailFormData.newWater,
    detailFormData.waterPrice,
  );
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

      <div className="mb-4">
        <h2 className="fw-bold mb-1">Chi tiết hóa đơn</h2>
        <p className="text-muted mb-0">
          Tháng {String(invoice.month).padStart(2, "0")}/{invoice.year}
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-9">
          <div className="card border-0 shadow-sm rounded-4 invoice-form-card">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="fw-bold mb-1">
                    Phòng {invoice.roomId?.roomCode}
                  </h5>
                  <div className="text-muted">
                    Khách thuê: {invoice.tenantId?.fullname}
                  </div>
                </div>

                <InvoiceStatusBadge status={invoice.status} />
              </div>

              <RoomPrice roomPrice={invoice.roomPrice} />

              <UtilityReadingSection
                title="Điện"
                iconClass="bi-lightning-charge-fill"
                iconColorClass="text-warning"
                fields={electricFields}
                estimatedLabel="Tiền điện"
                estimatedCost={electricCost}
                formData={detailFormData}
                errors={{}}
                onChange={() => {}}
                readOnly
              />

              <UtilityReadingSection
                title="Nước"
                iconClass="bi-droplet-fill"
                iconColorClass="text-primary"
                fields={waterFields}
                estimatedLabel="Tiền nước"
                estimatedCost={waterCost}
                formData={detailFormData}
                errors={{}}
                onChange={() => {}}
                readOnly
              />

              <ServiceFeeSelector
                serviceOptions={serviceOptions}
                selectedServices={selectedServices}
                onServiceChange={() => {}}
                readOnly
              />

              <InvoiceTotal totalCost={invoice.totalAmount} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default InvoiceDetailPage;
