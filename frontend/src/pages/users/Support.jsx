import { useEffect, useState } from "react";
import { sendSupport, getMySupportRequests } from "./services/userService";
import "./Style.css";

function Support() {
  const [content, setContent] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getMySupportRequests();
      setRequests(data.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      await sendSupport({ content });
      setContent("");
      await fetchRequests();
    } catch (err) {
      alert(err.message || "Lỗi khi gửi yêu cầu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-card">
      {/* Support Form Section */}
      <div className="card border-0 shadow-sm rounded-4 p-4 support-page mb-4">
        <div className="support-header">
          <h2>Gửi yêu cầu hỗ trợ</h2>
          <p>Mô tả vấn đề bạn gặp phải</p>
        </div>

        <div className="support-form">
          <label>Nội dung yêu cầu</label>

          <textarea
            className="support-textarea"
            placeholder="Nhập nội dung hỗ trợ của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
          />

          <button
            className="btn-primary support-btn"
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
          >
            {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </div>
      </div>

      {/* Support Requests List Section */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="support-header mb-4">
          <h3 className="mb-0">Lịch sử yêu cầu</h3>
        </div>

        {error && <div className="alert alert-danger rounded-3 mb-3">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-chat-dots fs-1 mb-3 d-block"></i>
            <p>Bạn chưa gửi yêu cầu hỗ trợ nào</p>
          </div>
        ) : (
          <div className="support-requests-list">
            {requests.map((request) => (
              <div
                key={request._id}
                className="card border-1 rounded-3 mb-3"
                style={{ borderColor: "#e9f7f1" }}
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="small text-muted">
                      <i className="bi bi-calendar me-2"></i>
                      {new Date(request.createdAt).toLocaleString("vi-VN")}
                    </div>
                    {request.roomId && (
                      <span className="badge bg-light text-dark rounded-pill">
                        {request.roomId.roomCode}
                      </span>
                    )}
                  </div>
                  <p className="mb-0">{request.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Support;
