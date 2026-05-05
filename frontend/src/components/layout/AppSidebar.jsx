import { NavLink } from "react-router-dom";
import "./AppSidebar.css";
import UserAppLayout from "./UserAppLayout";

const menuItems = [
  {
    label: "Tổng quan",
    icon: "bi bi-grid-fill",
    path: "/dashboard",
  },
  {
    label: "Phòng",
    icon: "bi bi-house-door-fill",
    path: "/rooms",
  },
  {
    label: "Khách thuê",
    icon: "bi bi-people-fill",
    path: "/tenants",
  },
  {
    label: "Hóa đơn",
    icon: "bi bi-receipt-cutoff",
    path: "/invoices",
  },

  {
    label: "Thu/chi",
    icon: "bi bi-wallet2",
    path: "/transactions",
  },
   {
    label: "Trang người dùng",
    icon: "bi bi-person-circle",
    path: "/user/my-room",
  },
];

const AppSidebar = () => {
  return (
    <aside className="col-2 col-lg-2 app-sidebar p-3">
      <div className="fw-bold fs-4 mb-4 sidebar-brand">QLPT</div>

      <nav className="d-flex flex-lg-column gap-2 sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `btn sidebar-btn d-flex align-items-center gap-2 w-100 ${
                isActive ? "active" : ""
              }`
            }
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AppSidebar;
