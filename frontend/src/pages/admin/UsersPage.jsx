import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { getUsersApi, toggleUserActiveApi, deleteUserApi } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

const ROLE_LABEL = { ADMIN: "Admin", LANDLORD: "Chủ trọ", TENANT: "Khách thuê" };
const ROLE_COLOR = { ADMIN: "danger", LANDLORD: "warning", TENANT: "primary" };

const UsersPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // id đang xử lý

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const data = await getUsersApi(token, params);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(1); }, [search, roleFilter]);

  const handleToggleActive = async (id) => {
    setActionLoading(id);
    try {
      await toggleUserActiveApi(token, id);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id, fullname) => {
    if (!window.confirm(`Xoá tài khoản "${fullname}"? Hành động này không thể hoàn tác.`)) return;
    setActionLoading(id);
    try {
      await deleteUserApi(token, id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Quản lý người dùng"
        description="Xem, chỉnh sửa và quản lý tài khoản trong hệ thống"
        action={
          <button
            className="btn fw-bold px-4 rounded-3"
            style={{ background: "#0f7f5f", color: "#fff" }}
            onClick={() => navigate("/admin/users/create")}
          >
            <i className="bi bi-person-plus me-2"></i>Thêm user
          </button>
        }
      />

      {/* Filter bar */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body d-flex gap-3 flex-wrap">
          <div className="flex-grow-1" style={{ minWidth: 200 }}>
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="Tìm theo tên, username, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-select rounded-3"
            style={{ maxWidth: 180 }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="ADMIN">Admin</option>
            <option value="LANDLORD">Chủ trọ</option>
            <option value="TENANT">Khách thuê</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <span className="spinner-border" style={{ color: "#0f7f5f" }}></span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead style={{ background: "#f6fbf8" }}>
                  <tr>
                    <th className="ps-4 py-3 fw-semibold text-muted small">Họ tên</th>
                    <th className="py-3 fw-semibold text-muted small">Username</th>
                    <th className="py-3 fw-semibold text-muted small">Vai trò</th>
                    <th className="py-3 fw-semibold text-muted small">Trạng thái</th>
                    <th className="py-3 fw-semibold text-muted small">Liên hệ</th>
                    <th className="pe-4 py-3 fw-semibold text-muted small text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">
                        <i className="bi bi-people fs-1 d-block mb-2"></i>
                        Không có user nào
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td className="ps-4">
                          <div className="fw-semibold">{u.fullname}</div>
                        </td>
                        <td className="text-muted small">{u.username}</td>
                        <td>
                          <span className={`badge bg-${ROLE_COLOR[u.role]}-subtle text-${ROLE_COLOR[u.role]} rounded-pill px-3`}>
                            {ROLE_LABEL[u.role] || u.role}
                          </span>
                        </td>
                        <td>
                          {u.isActive ? (
                            <span className="badge bg-success-subtle text-success rounded-pill px-3">Hoạt động</span>
                          ) : (
                            <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3">Đã khoá</span>
                          )}
                        </td>
                        <td className="text-muted small">
                          <div>{u.phone || "—"}</div>
                          <div>{u.email || "—"}</div>
                        </td>
                        <td className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-3 me-2"
                            onClick={() => navigate(`/admin/users/${u._id}`)}
                            title="Xem chi tiết"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className={`btn btn-sm rounded-3 me-2 ${u.isActive ? "btn-outline-warning" : "btn-outline-success"}`}
                            onClick={() => handleToggleActive(u._id)}
                            disabled={actionLoading === u._id}
                            title={u.isActive ? "Khoá tài khoản" : "Mở khoá"}
                          >
                            {actionLoading === u._id ? (
                              <span className="spinner-border spinner-border-sm"></span>
                            ) : (
                              <i className={`bi ${u.isActive ? "bi-lock" : "bi-unlock"}`}></i>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger rounded-3"
                            onClick={() => handleDelete(u._id, u.fullname)}
                            disabled={actionLoading === u._id}
                            title="Xoá"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="card-footer bg-transparent d-flex justify-content-between align-items-center px-4 py-3">
            <span className="text-muted small">
              Tổng {pagination.total} user
            </span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary rounded-3"
                disabled={pagination.page <= 1}
                onClick={() => fetchUsers(pagination.page - 1)}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <span className="btn btn-sm rounded-3" style={{ background: "#e9f7f1", color: "#0f7f5f" }}>
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary rounded-3"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchUsers(pagination.page + 1)}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default UsersPage;