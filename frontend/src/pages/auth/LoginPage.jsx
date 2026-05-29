import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      const data = await loginApi(form.username, form.password);
      login(data.user, data.token);
      // Chuyển hướng đúng theo role
      if (data.user.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.user.role === "LANDLORD") navigate("/dashboard");
      else navigate("/user/my-room");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "#f6fbf8" }}
    >
      <div
        className="card border-0 shadow-sm rounded-4 p-4"
        style={{ width: "100%", maxWidth: 420 }}
      >
        <div className="text-center mb-4">
          <div
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: 56, height: 56, background: "#e9f7f1" }}
          >
            <i
              className="bi bi-house-door-fill fs-3"
              style={{ color: "#0f7f5f" }}
            ></i>
          </div>
          <h4 className="fw-bold mb-1" style={{ color: "#0f7f5f" }}>
            Quản lý phòng trọ
          </h4>
          <p className="text-muted small">Đăng nhập để tiếp tục</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 rounded-3 small" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              className="form-control rounded-3"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small">Mật khẩu</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control rounded-start-3"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary rounded-end-3"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold rounded-3 py-2"
            style={{ background: "#0f7f5f", color: "#fff" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <p className="text-center text-muted small mt-3 mb-0">
          Liên hệ quản trị viên để được cấp tài khoản
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
