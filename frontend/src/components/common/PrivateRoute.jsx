import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Bọc quanh các route cần đăng nhập
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;