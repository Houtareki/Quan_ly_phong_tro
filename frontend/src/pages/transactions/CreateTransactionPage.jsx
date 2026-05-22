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
    EXPENSE: ["Sửa chữa", "Bảo trì", "Tiền điện nước chung", "Khác"],
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomData = await getRoomsList();
        setRooms(roomData);
      } catch (err) {
        console.error("Lỗi lấy danh sách phòng", err);
      }
    };
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: categories[type][0], // Reset danh mục tương ứng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createTransaction({
        ...formData,
        amount: Number(formData.amount),
      });
      navigate("/transactions");
    } catch (err) {
      setError(err.message || "Lỗi khi tạo giao dịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Thêm giao dịch"
        backButton={
          <button
            className="btn btn-light rounded-circle shadow-sm"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
        }
      />

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">
                    Loại giao dịch
                  </label>
                  <div className="d-flex gap-2 p-1 bg-light rounded-pill">
                    <button
                      type="button"
                      className={`btn flex-fill rounded-pill ${formData.type === "INCOME" ? "btn-success fw-bold text-white shadow-sm" : "btn-light text-muted"}`}
                      onClick={() => handleTypeChange("INCOME")}
                    >
                      <i className="bi bi-arrow-down-left me-2"></i>Thu
                    </button>
                    <button
                      type="button"
                      className={`btn flex-fill rounded-pill ${formData.type === "EXPENSE" ? "btn-danger fw-bold text-white shadow-sm" : "btn-light text-muted"}`}
                      onClick={() => handleTypeChange("EXPENSE")}
                    >
                      <i className="bi bi-arrow-up-right me-2"></i>Chi
                    </button>
                  </div>
                </div>

                {/* Số tiền */}
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control fw-bold fs-5 text-success"
                      id="amount"
                      name="amount"
                      placeholder="0"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="1"
                    />
                    <label htmlFor="amount">Số tiền (VNĐ)</label>
                  </div>
                </div>

                {/* Danh mục */}
                <div className="mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      {categories[formData.type].map((cat, idx) => (
                        <option key={idx} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="category">Danh mục</label>
                  </div>
                </div>

                {/* Ngày giao dịch */}
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="date">Ngày giao dịch</label>
                  </div>
                </div>

                {/* Liên quan phòng */}
                <div className="mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="roomId"
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleChange}
                    >
                      <option value="">-- Không chọn --</option>
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          Phòng {room.roomCode}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="roomId">Liên quan phòng (Tùy chọn)</label>
                  </div>
                </div>

                {/* Mô tả */}
                <div className="mb-4">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      placeholder="Mô tả"
                      style={{ height: "100px" }}
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                    <label htmlFor="description">Mô tả thêm</label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-light px-4 rounded-pill fw-bold"
                    onClick={() => navigate(-1)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success px-5 rounded-pill fw-bold shadow-sm"
                    disabled={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateTransactionPage;
