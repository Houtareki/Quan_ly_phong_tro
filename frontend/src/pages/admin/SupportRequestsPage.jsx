import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { getSupportRequestsApi, markSupportRequestReadApi } from "../../services/adminApi";

const SupportRequestsPage = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingId, setMarkingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getSupportRequestsApi(token);
      setRequests(res.supportRequests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
  }, [token]);

  const handleMarkRead = async (id) => {
    try {
      setMarkingId(id);
      await markSupportRequestReadApi(token, id);
      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (err) {
      alert(err.message || "Không thể đánh dấu đã đọc");
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Yêu cầu hỗ trợ"
        description={`Danh sách các yêu cầu hỗ trợ từ khách thuê (${requests.filter((req) => !req.isRead).length} chưa đọc)`}
      />

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <span className="spinner-border" style={{ color: "#0f7f5f" }}></span>
        </div>
      ) : requests.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <i className="bi bi-chat-dots fs-1 mb-3 d-block" style={{ color: "#0f7f5f" }}></i>
            <h5 className="fw-bold">Chưa có yêu cầu hỗ trợ</h5>
            <p className="text-muted small">Khách thuê chưa gửi yêu cầu hỗ trợ nào.</p>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {requests.map((request) => (
            <div className="col-12" key={request._id}>
              <div className={`card border-0 shadow-sm rounded-4 ${request.isRead ? "" : "border-warning"}`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3 gap-3 flex-column flex-md-row">
                    <div>
                      <h6 className="fw-bold mb-1">{request.roomId?.roomCode || "Phòng không rõ"}</h6>
                      <div className="text-muted small">
                        <span className="me-3">Khách thuê: {request.tenantId?.fullname || request.tenantId?.username || "Không rõ"}</span>
                        <span>{new Date(request.createdAt).toLocaleString("vi-VN")}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className={`badge rounded-pill ${request.isRead ? "bg-secondary" : "bg-warning text-dark"}`}>
                        {request.isRead ? "Đã đọc" : "Chưa đọc"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1 small text-muted">Nội dung</p>
                    <p className="mb-0">{request.description}</p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center flex-column flex-sm-row gap-2 mt-3">
                    {!request.isRead && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        disabled={markingId === request._id}
                        onClick={() => handleMarkRead(request._id)}
                      >
                        {markingId === request._id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          "Đánh dấu đã đọc"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default SupportRequestsPage;
