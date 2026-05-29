import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TenantRoute = ({ children }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "TENANT") return <Navigate to="/login" replace />;
  return children;
};

export default TenantRoute;