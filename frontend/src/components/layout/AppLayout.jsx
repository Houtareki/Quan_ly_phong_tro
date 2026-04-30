import AppSidebar from "./AppSidebar";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  return (
    <div className="container-fluid invoice-page">
      <div className="row min-vh-100">
        <AppSidebar />

        <main className="col-12 col-lg-10 p-4 app-main">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
