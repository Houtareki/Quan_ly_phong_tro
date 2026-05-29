import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AppLayout.css";
import "./AppSidebar.css";

function UserAppLayout() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container-fluid invoice-page">
      <div className="row min-vh-100">
        {/* Sidebar */}
        <aside className="col-2 col-lg-2 app-sidebar p-3 d-flex flex-column">
          <div className="fw-bold fs-4 mb-4 sidebar-brand">Khách Thuê</div>

          <nav className="d-flex flex-lg-column gap-2 sidebar-menu flex-grow-1">
            <NavLink
              to="/user/my-room"
              className={({ isActive }) =>
                `btn sidebar-btn d-flex align-items-center gap-2 w-100 ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-house-door-fill"></i>
              <span>Phòng của tôi</span>
            </NavLink>

            <NavLink
              to="/user/my-invoices"
              className={({ isActive }) =>
                `btn sidebar-btn d-flex align-items-center gap-2 w-100 ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-receipt-cutoff"></i>
              <span>Hóa đơn</span>
            </NavLink>

            <NavLink
              to="/user/support"
              className={({ isActive }) =>
                `btn sidebar-btn d-flex align-items-center gap-2 w-100 ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-headset"></i>
              <span>Hỗ trợ</span>
            </NavLink>
          </nav>

          {/* User info + logout */}
          <div className="mt-auto pt-3 border-top">
            {user && (
              <div className="d-flex align-items-center gap-2 mb-2 px-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 32, height: 32, background: "#d7eee4" }}
                >
                  <i className="bi bi-person-fill small" style={{ color: "#0f7f5f" }}></i>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="fw-semibold small text-truncate" style={{ color: "#0f7f5f" }}>
                    {user.fullname}
                  </div>
                  <div className="text-muted" style={{ fontSize: 11 }}>Khách thuê</div>
                </div>
              </div>
            )}
            <button
              className="btn sidebar-btn d-flex align-items-center gap-2 w-100"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-12 col-lg-10 p-4 app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default UserAppLayout;
