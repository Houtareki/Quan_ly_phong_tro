import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AppSidebar.css";

const MENU = {
  ADMIN: [
    { label: "Dashboard", icon: "bi bi-grid-fill", path: "/admin/dashboard" },
    { label: "Quản lý user", icon: "bi bi-people-fill", path: "/admin/users" },
    { label: "Yêu cầu hỗ trợ", icon: "bi bi-chat-left-text-fill", path: "/support-requests" },
    {
      label: "Duyệt phòng",
      icon: "bi bi-house-check-fill",
      path: "/admin/rooms/approval",
    },
  ],
  LANDLORD: [
    { label: "Tổng quan", icon: "bi bi-grid-fill", path: "/dashboard" },
    { label: "Quản lý phòng", icon: "bi bi-house-door-fill", path: "/rooms" },
    { label: "Yêu cầu hỗ trợ", icon: "bi bi-chat-left-text-fill", path: "/support-requests" },
    { label: "Hóa đơn", icon: "bi bi-receipt-cutoff", path: "/invoices" },
    { label: "Thu chi", icon: "bi bi-cash-coin", path: "/transactions" },
  ],
  TENANT: [
    { label: "Phòng của tôi", icon: "bi bi-house-fill", path: "/user/my-room" },
    { label: "Hợp đồng", icon: "bi bi-file-earmark-text-fill", path: "/user/my-contract" },
    {
      label: "Hóa đơn",
      icon: "bi bi-receipt-cutoff",
      path: "/user/my-invoices",
    },
    { label: "Hỗ trợ", icon: "bi bi-headset", path: "/user/support" },
  ],
};

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = MENU[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="col-2 col-lg-2 app-sidebar p-3 d-flex flex-column">
      <div className="fw-bold fs-4 mb-4 sidebar-brand">QLPT</div>

      <nav className="d-flex flex-lg-column gap-2 sidebar-menu flex-grow-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `btn sidebar-btn d-flex align-items-center gap-2 w-100 ${isActive ? "active" : ""}`
            }
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex align-items-center gap-2 mb-2 px-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 32, height: 32, background: "#d7eee4" }}
            >
              <i
                className="bi bi-person-fill small"
                style={{ color: "#0f7f5f" }}
              ></i>
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                className="fw-semibold small text-truncate"
                style={{ color: "#0f7f5f" }}
              >
                {user.fullname}
              </div>
              <div className="text-muted" style={{ fontSize: 11 }}>
                {user.role}
              </div>
            </div>
          </div>
          <button
            className="btn sidebar-btn d-flex align-items-center gap-2 w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
