import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { createTransaction, getRoomsList } from "./services/transactionApi";

const CreateTransactionPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: "INCOME",
    amount: "",
    category: "Tiền thuê phòng",
    date: new Date().toISOString().split("T")[0],
    roomId: "",
    description: "",
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = {
    INCOME: [
      "Tiền thuê phòng",
      "Tiền dịch vụ",
      "Thu tiền hóa đơn tháng",
      "Khác",
    ],
    EXPENSE: [
      "Sửa chữa",
      "Bảo trì",
      "Tiền điện nước chung",
      "Hoàn cọc",
      "Khác",
    ],
  };

  return (
    <AppLayout>
      <PageHeader
        title="Tạo giao dịch"
        description="Thêm thu hoặc chi mới vào hệ thống"
        action={
          <button
            type="button"
            className="btn btn-outline-secondary fw-bold px-4 rounded-pill"
            onClick={() => navigate("/transactions")}
          >
            <i className="bi bi-arrow-left me-2"></i> Quay lại
          </button>
        }
      />
    </AppLayout>
  );
};

export default CreateTransactionPage;
