import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { getUserByIdApi, updateUserApi, toggleUserActiveApi } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByIdApi(token, id);
        setUser(data);
        setForm({
          fullname: data.fullname || "",
          phone: data.phone || "",
          email: data.email || "",
          cccd: data.cccd || "",
          role: data.role || "TENANT",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateUserApi(token, id, form);
      setUser(updated);
      setSuccess("Đã lưu thay đổi thành công");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!window.confirm(`${user.isActive ? "Khoá" : "Mở khoá"} tài khoản này?`)) return;
    setToggling(true);
    try {
      await toggleUserActiveApi(token, id);
      setUser((prev) => ({ ...prev, isActive: !prev.isActive }));
      setSuccess(user.isActive ? "Đã khoá tài khoản" : "Đã mở khoá tài khoản");
    } catch (err) {
      setError(err.message);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-5">
          <span className="spinner-border" style={{ color: "#0f7f5f" }}></span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Chi tiết người dùng"
        description={user ? `@${user.username}` : ""}
        backButton={
          <button
            className="btn btn-outline-secondary rounded-3"
            onClick={() => navigate("/admin/users")}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
        }
        action={
          user && (
            <button
              className={`btn fw-bold px-4 rounded-3 ${user.isActive ? "btn-outline-warning" : "btn-outline-success"}`}
              onClick={handleToggleActive}
              disabled={toggling}
            >
              {toggling ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className={`bi ${user.isActive ? "bi-lock" : "bi-unlock"} me-2`}></i>
              )}
              {user.isActive ? "Khoá tài khoản" : "Mở khoá"}
            </button>
          )
        }
      />

      {error && <div className="alert alert-danger rounded-3">{error}</div>}
      {success && <div className="alert alert-success rounded-3">{success}</div>}

      {user && (
        <div className="row g-4">
          {/* Thông tin cơ bản (readonly) */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body text-center p-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 72, height: 72, background: "#e9f7f1" }}
                >
                  <i className="bi bi-person-fill fs-2" style={{ color: "#0f7f5f" }}></i>
                </div>
                <h5 className="fw-bold mb-1">{user.fullname}</h5>
                <p className="text-muted small mb-2">@{user.username}</p>
                <span className={`badge rounded-pill px-3 py-2 ${user.isActive ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
                  {user.isActive ? "Đang hoạt động" : "Đã khoá"}
                </span>
                <hr />
                <div className="text-start small text-muted">
                  <div className="mb-2">
                    <i className="bi bi-shield-fill me-2" style={{ color: "#0f7f5f" }}></i>
                    <strong>Role:</strong> {user.role}
                  </div>
                  {user.createdAt && (
                    <div>
                      <i className="bi bi-calendar me-2" style={{ color: "#0f7f5f" }}></i>
                      <strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form chỉnh sửa */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-4">Chỉnh sửa thông tin</h6>
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Họ và tên</label>
                      <input
                        type="text" name="fullname" className="form-control rounded-3"
                        value={form.fullname} onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Số điện thoại</label>
                      <input
                        type="tel" name="phone" className="form-control rounded-3"
                        value={form.phone} onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Email</label>
                      <input
                        type="email" name="email" className="form-control rounded-3"
                        value={form.email} onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">CCCD</label>
                      <input
                        type="text" name="cccd" className="form-control rounded-3"
                        value={form.cccd} onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Vai trò</label>
                      <select name="role" className="form-select rounded-3" value={form.role} onChange={handleChange}>
                        <option value="ADMIN">Admin</option>
                        <option value="LANDLORD">Chủ trọ</option>
                        <option value="TENANT">Khách thuê</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn fw-bold px-4 rounded-3"
                      style={{ background: "#0f7f5f", color: "#fff" }}
                      disabled={saving}
                    >
                      {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Đang lưu...</> : "Lưu thay đổi"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-3 px-4"
                      onClick={() => navigate("/admin/users")}
                    >
                      Huỷ
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default UserDetailPage;