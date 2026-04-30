import { formatCurrency } from "../../../../utils/formatCurrency";

const RoomPrice = ({ roomPrice = 0 }) => {
  return (
    <div className="room-price-box mb-4">
      <div>
        <span className="text-muted">Tiền phòng</span>
        <h5 className="fw-bold mb-0">{formatCurrency(roomPrice || 0)}</h5>
      </div>

      <i className="bi bi-house-check-fill"></i>
    </div>
  );
};

export default RoomPrice;
