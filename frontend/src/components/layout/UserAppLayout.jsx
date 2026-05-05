import { NavLink, Outlet } from "react-router-dom";
import "./UserAppLayout.css"
function UserAppLayout() {
  return (
    <div className="user-layout d-flex">
      
      {/* Sidebar */}
      <div className="user-sidebar">
        <h4 className="p-3">User Panel</h4>

        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/user/my-room" className="nav-link">
              Phòng của tôi
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/user/my-invoices" className="nav-link">
              Hóa đơn
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/user/support" className="nav-link">
              Hỗ trợ
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="user-content flex-grow-1">
        <div className="user-header">
          <h5>Xin chào người dùng</h5>
        </div>

        <div className="user-main p-3">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default UserAppLayout;