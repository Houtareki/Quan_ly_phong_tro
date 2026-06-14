import { useEffect, useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { getRooms, getTenants, createContract, deleteContract } from "../../services/roomApi";
import { useAuth } from "../../context/AuthContext";
import { getRoomStatusLabel } from "../../utils/roomStatus";

// Removed roomType tag display (no visible tags shown)

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const RoomsPage = () => {
  const { user, token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tenants, setTenants] = useState([]);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewContractRoom, setViewContractRoom] = useState(null);
  const [deleteConfirmRoom, setDeleteConfirmRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [contractForm, setContractForm] = useState({
    tenantId: "",
    startDate: "",
    endDate: "",
    deposit: 0,
    monthlyPrice: 0,
    contractImageFiles: [],
  });
  const [contractError, setContractError] = useState("");
  const [contractLoading, setContractLoading] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const data = await getTenants(token);
      setTenants(data);
    } catch (err) {
      console.error("Lỗi lấy khách thuê:", err.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user]);

  useEffect(() => {
    if (token) fetchTenants();
  }, [token]);

  const visibleRooms = rooms.filter((room) =>
    room.roomCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openContractModal = (room) => {
    setSelectedRoom(room);
    setContractForm({
      tenantId: "",
      startDate: "",
      endDate: "",
      deposit: 0,
      monthlyPrice: room.defaultPrice || 0,
      contractImageFiles: [],
    });
    setContractError("");
    setContractModalOpen(true);
  };

  const closeContractModal = () => {
    setContractModalOpen(false);
    setSelectedRoom(null);
    setContractError("");
  };

  const openViewContractModal = (room) => {
    setViewContractRoom(room);
  };

  const closeViewContractModal = () => {
    setViewContractRoom(null);
  };

  const openDeleteConfirmModal = (room) => {
    setDeleteConfirmRoom(room);
  };

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmRoom(null);
  };

  const handleDeleteContract = async () => {
    if (!deleteConfirmRoom || !deleteConfirmRoom.contractId) return;

    setDeleteLoading(true);
    try {
      await deleteContract(token, deleteConfirmRoom.contractId._id);
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === deleteConfirmRoom._id
            ? { ...room, status: "AVAILABLE", contractId: null }
            : room,
        ),
      );
      closeDeleteConfirmModal();
    } catch (err) {
      console.error("Lỗi xóa hợp đồng:", err.message);
      alert("Xóa hợp đồng thất bại: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateContract = async (event) => {
    event.preventDefault();
    if (!selectedRoom) return;

    if (!contractForm.tenantId) {
      setContractError("Vui lòng chọn khách thuê");
      return;
    }
    if (!contractForm.startDate || !contractForm.endDate) {
      setContractError("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }

    setContractLoading(true);
    setContractError("");

    try {
      const payload = {
        roomId: selectedRoom._id,
        tenantId: contractForm.tenantId,
        startDate: contractForm.startDate,
        endDate: contractForm.endDate,
        deposit: Number(contractForm.deposit || 0),
        monthlyPrice: Number(contractForm.monthlyPrice || selectedRoom.defaultPrice || 0),
        contractImages: [],
      };

      if (contractForm.contractImageFiles && contractForm.contractImageFiles.length > 0) {
        payload.contractImages = await Promise.all(
          Array.from(contractForm.contractImageFiles).map((file) => fileToBase64(file))
        );
      }

      const contract = await createContract(token, payload);
      const tenant = tenants.find((t) => t._id === contract.tenantId) || contract.tenantId;
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === selectedRoom._id
            ? { ...room, status: "RENTED", contractId: { ...contract, tenantId: tenant } }
            : room,
        ),
      );
      closeContractModal();
    } catch (err) {
      setContractError(err.message);
    } finally {
      setContractLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title="Quản lý phòng" description={`${visibleRooms.length} / ${rooms.length} phòng hiện có`} />

      <div className="mb-4" style={{ maxWidth: 420 }}>
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo mã phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <span className="spinner-border" style={{ color: "#0f7f5f" }}></span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <i className="bi bi-house fs-1 mb-3 d-block" style={{ color: "#0f7f5f" }}></i>
            <h5 className="fw-bold">Chưa có phòng nào</h5>
            <p className="text-muted small">Bạn chưa đăng phòng nào hoặc không có phòng để hiển thị.</p>
          </div>
        </div>
      ) : visibleRooms.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5">
            <i className="bi bi-search fs-1 mb-3 d-block" style={{ color: "#0f7f5f" }}></i>
            <h5 className="fw-bold">Không tìm thấy phòng</h5>
            <p className="text-muted small">Không tìm thấy phòng phù hợp với mã {searchTerm}.</p>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {visibleRooms.map((room) => (
            <div className="col-12 col-lg-6" key={room._id}>
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">{room.roomCode}</h6>
                      {/* roomType tags intentionally hidden */}
                    </div>
                    <div className="text-end">
                      <div className="fw-bold" style={{ color: "#0f7f5f" }}>
                        {room.defaultPrice?.toLocaleString("vi-VN")}đ
                      </div>
                      <div className="text-muted small">/tháng</div>
                    </div>
                  </div>

                  <div className="small text-muted mb-3">
                    <div className="mb-1">
                      <i className="bi bi-rulers me-2"></i>
                      <strong>Diện tích:</strong> {room.area ? `${room.area} m²` : "—"}
                    </div>
                    <div className="mb-1">
                      <i className="bi bi-activity me-2"></i>
                      <strong>Trạng thái:</strong> {getRoomStatusLabel(room.status)}
                    </div>
                  </div>

                  {(room.status === "AVAILABLE" || room.status === "RENTED") && (
                    <div className="mt-auto d-flex gap-2">
                      {room.status === "AVAILABLE" && (
                        <button
                          className="btn btn-sm fw-bold px-3 rounded-3 flex-grow-1"
                          style={{ background: "#0f7f5f", color: "#fff" }}
                          onClick={() => openContractModal(room)}
                        >
                          Tạo hợp đồng
                        </button>
                      )}
                      {room.status === "RENTED" && (
                        <>
                          <button
                            className="btn btn-sm fw-bold px-3 rounded-3 flex-grow-1"
                            style={{ background: "#0f7f5f", color: "#fff" }}
                            onClick={() => openViewContractModal(room)}
                          >
                            Xem hợp đồng
                          </button>
                          <button
                            className="btn btn-sm fw-bold px-3 rounded-3 flex-grow-1"
                            style={{ background: "#dc2626", color: "#fff" }}
                            onClick={() => openDeleteConfirmModal(room)}
                          >
                            Xóa hợp đồng
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {contractModalOpen && selectedRoom && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Tạo hợp đồng cho {selectedRoom.roomCode}</h5>
                <button className="btn-close" onClick={closeContractModal}></button>
              </div>
              <form onSubmit={handleCreateContract}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Chọn khách thuê</label>
                    <select
                      className="form-select"
                      value={contractForm.tenantId}
                      onChange={(e) =>
                        setContractForm((prev) => ({ ...prev, tenantId: e.target.value }))
                      }
                    >
                      <option value="">Chọn khách thuê</option>
                      {tenants.map((tenant) => (
                        <option key={tenant._id} value={tenant._id}>
                          {tenant.fullname} (@{tenant.username})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label">Ngày bắt đầu</label>
                      <input
                        type="date"
                        className="form-control"
                        value={contractForm.startDate}
                        onChange={(e) =>
                          setContractForm((prev) => ({ ...prev, startDate: e.target.value }))
                        }
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Ngày kết thúc</label>
                      <input
                        type="date"
                        className="form-control"
                        value={contractForm.endDate}
                        onChange={(e) =>
                          setContractForm((prev) => ({ ...prev, endDate: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label">Giá thuê (tháng)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={contractForm.monthlyPrice}
                        onChange={(e) =>
                          setContractForm((prev) => ({
                            ...prev,
                            monthlyPrice: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Tiền đặt cọc</label>
                      <input
                        type="number"
                        className="form-control"
                        value={contractForm.deposit}
                        onChange={(e) =>
                          setContractForm((prev) => ({ ...prev, deposit: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ảnh hợp đồng (có thể up nhiều)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="form-control"
                      onChange={(e) =>
                        setContractForm((prev) => ({
                          ...prev,
                          contractImageFiles: e.target.files || [],
                        }))
                      }
                    />
                    {contractForm.contractImageFiles && contractForm.contractImageFiles.length > 0 && (
                      <small className="text-muted">
                        Đã chọn {contractForm.contractImageFiles.length} ảnh
                      </small>
                    )}
                  </div>

                  {contractError && (
                    <div className="alert alert-danger rounded-3">{contractError}</div>
                  )}
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-3"
                    onClick={closeContractModal}
                    disabled={contractLoading}
                  >
                    Huỷ
                  </button>
                  <button type="submit" className="btn btn-primary rounded-3 fw-bold" disabled={contractLoading}>
                    {contractLoading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Tạo hợp đồng"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {viewContractRoom && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Hợp đồng phòng {viewContractRoom.roomCode}</h5>
                <button className="btn-close" onClick={closeViewContractModal}></button>
              </div>
              <div className="modal-body">
                {viewContractRoom.contractId ? (
                  <>
                    <div className="user-info-list">
                      <p>
                        <strong>Mã phòng:</strong> {viewContractRoom.roomCode}
                      </p>
                      <p>
                        <strong>Khách thuê:</strong> {viewContractRoom.contractId.tenantId?.fullname || "Không rõ"}
                      </p>
                      <p>
                        <strong>Ngày bắt đầu:</strong> {new Date(viewContractRoom.contractId.startDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <strong>Ngày kết thúc:</strong> {new Date(viewContractRoom.contractId.endDate).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        <strong>Giá thuê:</strong> {viewContractRoom.contractId.monthlyPrice?.toLocaleString("vi-VN")} VND/tháng
                      </p>
                      <p>
                        <strong>Tiền đặt cọc:</strong> {viewContractRoom.contractId.deposit?.toLocaleString("vi-VN")} VND
                      </p>
                    </div>

                    {viewContractRoom.contractId.contractImages && viewContractRoom.contractId.contractImages.length > 0 ? (
                      <div className="mt-4">
                        <strong>Ảnh hợp đồng ({viewContractRoom.contractId.contractImages.length}):</strong>
                        <div className="mt-3 d-flex flex-wrap gap-2">
                          {viewContractRoom.contractId.contractImages.map((image, idx) => (
                            <div key={idx} style={{ flex: "0 0 calc(50% - 0.5rem)" }}>
                              <img
                                src={image}
                                alt={`Ảnh hợp đồng ${idx + 1}`}
                                style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 8 }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-secondary rounded-3 mt-3">
                        Chưa có ảnh hợp đồng được tải lên.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="alert alert-warning rounded-3">
                    Không tìm thấy thông tin hợp đồng cho phòng này.
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3"
                  onClick={closeViewContractModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmRoom && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.35)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">Xóa hợp đồng</h5>
                <button className="btn-close" onClick={closeDeleteConfirmModal}></button>
              </div>
              <div className="modal-body">
                <p>
                  Bạn có chắc chắn muốn xóa hợp đồng của phòng <strong>{deleteConfirmRoom.roomCode}</strong>?
                </p>
                <p className="text-muted small">
                  Sau khi xóa, phòng sẽ trở thành chưa có hợp đồng và bạn có thể tạo hợp đồng mới.
                </p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-3"
                  onClick={closeDeleteConfirmModal}
                  disabled={deleteLoading}
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  className="btn btn-danger rounded-3 fw-bold"
                  onClick={handleDeleteContract}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  Xóa hợp đồng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
};

export default RoomsPage;
