import { NavLink, Outlet } from "react-router-dom";
// Import tái sử dụng CSS của Admin
import "./AppLayout.css";
import "./AppSidebar.css";

function UserAppLayout() {
  return (
    <div className="container-fluid invoice-page">
      <div className="row min-vh-100">
        {/* Sidebar dùng chung class với Admin */}
        <aside className="col-2 col-lg-2 app-sidebar p-3">
          <div className="fw-bold fs-4 mb-4 sidebar-brand">Khách Thuê</div>

          <nav className="d-flex flex-lg-column gap-2 sidebar-menu">
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
