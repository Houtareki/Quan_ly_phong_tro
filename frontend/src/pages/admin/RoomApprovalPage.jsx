import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { getPendingRoomsApi, approveRoomApi, rejectRoomApi } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

const RoomApprovalPage = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, roomId: null, note: "" });

  const fetchRooms = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingRoomsApi(token, { page, limit: 10 });
      setRooms(data.rooms);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(1); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Duyệt phòng này?")) return;
    setActionLoading(id);
    try {
      await approveRoomApi(token, id);
      setRooms((prev) => prev.filter((r) => r._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async () => {
    const { roomId, note } = rejectModal;
    setActionLoading(roomId);
    setRejectModal({ open: false, roomId: null, note: "" });
    try {
      await rejectRoomApi(token, roomId, note);
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Duyệt bài đăng phòng"
        description={`${pagination.total} phòng đang chờ duyệt`}
      />

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <span className="spinner-border" style={{ color: "#0f7f5f" }}></span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <i className="bi bi-check-circle fs-1 mb-3 d-block" style={{ color: "#0f7f5f" }}></i>
            <h5 className="fw-bold">Không có phòng nào chờ duyệt</h5>
            <p className="text-muted small">Tất cả bài đăng đã được xử lý</p>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {rooms.map((room) => (
            <div className="col-12 col-lg-6" key={room._id}>
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">{room.roomCode}</h6>
                      <span className="badge bg-warning-subtle text-warning rounded-pill px-3 small">
                        Chờ duyệt
                      </span>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold" style={{ color: "#0f7f5f" }}>
                        {room.defaultPrice?.toLocaleString("vi-VN")}đ
                      </div>
                      <div className="text-muted small">/tháng</div>
                    </div>
                  </div>

                  <div className="small text-muted mb-3">
                    {/* roomType removed from approval view */}
                    <div className="mb-1">
                      <i className="bi bi-rulers me-2"></i>
                      <strong>Diện tích:</strong> {room.area ? `${room.area} m²` : "—"}
                    </div>
                    {room.landlordId && (
                      <div>
                        <i className="bi bi-person me-2"></i>
                        <strong>Chủ trọ:</strong> {room.landlordId.fullname} (@{room.landlordId.username})
                      </div>
                    )}
                  </div>

                  {room.assets?.length > 0 && (
                    <div className="mb-3">
                      <div className="small fw-semibold mb-1">Nội thất:</div>
                      <div className="d-flex flex-wrap gap-1">
                        {room.assets.slice(0, 4).map((a, i) => (
                          <span key={i} className="badge bg-light text-dark border rounded-pill small">
                            {a.name}
                          </span>
                        ))}
                        {room.assets.length > 4 && (
                          <span className="badge bg-light text-muted border rounded-pill small">
                            +{room.assets.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-sm fw-bold px-3 rounded-3 flex-grow-1"
                      style={{ background: "#0f7f5f", color: "#fff" }}
                      onClick={() => handleApprove(room._id)}
                      disabled={actionLoading === room._id}
                    >
                      {actionLoading === room._id ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        <><i className="bi bi-check-lg me-1"></i>Duyệt</>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger fw-bold px-3 rounded-3 flex-grow-1"
                      onClick={() => setRejectModal({ open: true, roomId: room._id, note: "" })}
                      disabled={actionLoading === room._id}
                    >
                      <i className="bi bi-x-lg me-1"></i>Từ chối
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          <button className="btn btn-outline-secondary rounded-3" disabled={pagination.page <= 1} onClick={() => fetchRooms(pagination.page - 1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <span className="btn rounded-3" style={{ background: "#e9f7f1", color: "#0f7f5f" }}>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button className="btn btn-outline-secondary rounded-3" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchRooms(pagination.page + 1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Modal từ chối */}
      {rejectModal.open && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h6 className="modal-title fw-bold">Lý do từ chối</h6>
                <button className="btn-close" onClick={() => setRejectModal({ open: false, roomId: null, note: "" })}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control rounded-3"
                  rows={3}
                  placeholder="Nhập lý do từ chối (không bắt buộc)..."
                  value={rejectModal.note}
                  onChange={(e) => setRejectModal((prev) => ({ ...prev, note: e.target.value }))}
                />
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-outline-secondary rounded-3" onClick={() => setRejectModal({ open: false, roomId: null, note: "" })}>
                  Huỷ
                </button>
                <button className="btn btn-danger rounded-3 fw-bold" onClick={handleRejectConfirm}>
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default RoomApprovalPage;