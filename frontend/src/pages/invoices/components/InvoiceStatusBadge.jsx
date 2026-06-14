import { getStatusClass, getStatusLabel } from "../utils/invoiceUtils";
import "./InvoiceStatusBadge.css";

const InvoiceStatusBadge = ({ status }) => {
  return (
    <span
      className={`badge rounded-pill status-pill ${getStatusClass(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default InvoiceStatusBadge;
