import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DebugUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/debug-users`);
      if (!res.ok) throw new Error("Không thể tải danh sách tài khoản");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleResetPassword = async (username) => {
    setMessage("");
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/debug-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đặt lại mật khẩu thất bại");
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-danger mb-1">
              <i className="bi bi-bug-fill me-2"></i>Trang Xem Tài Khoản Hệ
              Thống
            </h3>
            <p className="text-muted small mb-0">
              Hiển thị tài khoản và hỗ trợ reset mật khẩu về nhanh 123456
            </p>
          </div>
          <Link
            to="/login"
            className="btn btn-outline-secondary rounded-pill btn-sm"
          >
            <i className="bi bi-box-arrow-in-right me-1"></i> Quay lại trang
            Đăng nhập
          </Link>
        </div>

        {error && (
          <div className="alert alert-danger py-2 rounded-3 small" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {message && (
          <div
            className="alert alert-success py-2 rounded-3 small"
            role="alert"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tên đăng nhập (Username)</th>
                  <th>Họ và tên</th>
                  <th>Vai trò (Role)</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="fw-bold text-dark">{user.username}</td>
                    <td>{user.fullname}</td>
                    <td>
                      <span
                        className={`badge ${user.role === "ADMIN" ? "bg-danger" : user.role === "LANDLORD" ? "bg-warning text-dark" : "bg-primary"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{user.email || "N/A"}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-3"
                        onClick={() => handleResetPassword(user.username)}
                      >
                        <i className="bi bi-shield-lock me-1"></i> Reset mật
                        khẩu thành 123456
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Không có tài khoản nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugUsersPage;
