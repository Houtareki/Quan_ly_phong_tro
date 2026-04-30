import { formatCurrency } from "../../../../utils/formatCurrency";

const InvoiceTotal = ({ totalCost }) => {
  return (
    <div className="total-box mb-4">
      <span>Tổng cộng: </span>
      <strong>{formatCurrency(totalCost)}</strong>
    </div>
  );
};

export default InvoiceTotal;
