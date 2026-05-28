import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "", password: "", confirmPassword: "",
    fullname: "", phone: "", email: "", role: "TENANT",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { confirmPassword, ...payload } = form;
      const data = await registerApi(payload);
      login(data.user, data.token);
      navigate("/invoices");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-4"
      style={{ background: "#f6fbf8" }}
    >
      <div className="card border-0 shadow-sm rounded-4 p-4" style={{ width: "100%", maxWidth: 460 }}>
        <div className="text-center mb-4">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 56, height: 56, background: "#e9f7f1" }}
          >
            <i className="bi bi-person-plus-fill fs-3" style={{ color: "#0f7f5f" }}></i>
          </div>
          <h4 className="fw-bold mb-1" style={{ color: "#0f7f5f" }}>Tạo tài khoản</h4>
          <p className="text-muted small">Điền thông tin để đăng ký</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 rounded-3 small">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold small">Họ và tên <span className="text-danger">*</span></label>
              <input type="text" name="fullname" className="form-control rounded-3"
                placeholder="Nguyễn Văn A" value={form.fullname} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold small">Tên đăng nhập <span className="text-danger">*</span></label>
              <input type="text" name="username" className="form-control rounded-3"
                placeholder="username123" value={form.username} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">Mật khẩu <span className="text-danger">*</span></label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"} name="password"
                  className="form-control rounded-start-3" placeholder="••••••••"
                  value={form.password} onChange={handleChange} required
                />
                <button type="button"
                  className="btn btn-outline-secondary rounded-end-3"
                  onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">Xác nhận mật khẩu <span className="text-danger">*</span></label>
              <div className="input-group">
                <input
                  type={showConfirm ? "text" : "password"} name="confirmPassword"
                  className="form-control rounded-start-3" placeholder="••••••••"
                  value={form.confirmPassword} onChange={handleChange} required
                />
                <button type="button"
                  className="btn btn-outline-secondary rounded-end-3"
                  onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                  <i className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">Số điện thoại</label>
              <input type="tel" name="phone" className="form-control rounded-3"
                placeholder="0912345678" value={form.phone} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold small">Email</label>
              <input type="email" name="email" className="form-control rounded-3"
                placeholder="email@example.com" value={form.email} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold small">Vai trò</label>
              <select name="role" className="form-select rounded-3" value={form.role} onChange={handleChange}>
                <option value="TENANT">Khách thuê</option>
                <option value="LANDLORD">Chủ trọ</option>
              </select>
            </div>
          </div>

          <button type="submit"
            className="btn w-100 fw-bold rounded-3 py-2 mt-4"
            style={{ background: "#0f7f5f", color: "#fff" }}
            disabled={loading}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2"></span>Đang đăng ký...</>
              : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "#0f7f5f", fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;