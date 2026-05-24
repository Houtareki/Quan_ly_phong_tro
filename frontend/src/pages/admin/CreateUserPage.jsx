import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import { createUserApi } from "../../services/adminApi";
import { useAuth } from "../../context/AuthContext";

const CreateUserPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    phone: "",
    email: "",
    cccd: "",
    role: "TENANT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserApi(token, form);
      navigate("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Thêm người dùng"
        description="Tạo tài khoản mới trong hệ thống"
        backButton={
          <button
            className="btn btn-outline-secondary rounded-3"
            onClick={() => navigate("/admin/users")}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
        }
      />

      <div className="row justify-content-center">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger rounded-3 small">
                  <i className="bi bi-exclamation-circle me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold small">
                      Họ và tên <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text" name="fullname" className="form-control rounded-3"
                      placeholder="Nguyễn Văn A" value={form.fullname}
                      onChange={handleChange} required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      Tên đăng nhập <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text" name="username" className="form-control rounded-3"
                      placeholder="username123" value={form.username}
                      onChange={handleChange} required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">
                      Mật khẩu <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password" name="password" className="form-control rounded-3"
                      placeholder="••••••••" value={form.password}
                      onChange={handleChange} required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Số điện thoại</label>
                    <input
                      type="tel" name="phone" className="form-control rounded-3"
                      placeholder="0912345678" value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Email</label>
                    <input
                      type="email" name="email" className="form-control rounded-3"
                      placeholder="email@example.com" value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">CCCD</label>
                    <input
                      type="text" name="cccd" className="form-control rounded-3"
                      placeholder="012345678901" value={form.cccd}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Vai trò</label>
                    <select
                      name="role" className="form-select rounded-3"
                      value={form.role} onChange={handleChange}
                    >
                      <option value="TENANT">Khách thuê</option>
                      <option value="LANDLORD">Chủ trọ</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn fw-bold px-4 rounded-3"
                    style={{ background: "#0f7f5f", color: "#fff" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2"></span>Đang tạo...</>
                    ) : (
                      <><i className="bi bi-person-plus me-2"></i>Tạo tài khoản</>
                    )}
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
    </AppLayout>
  );
};

export default CreateUserPage;