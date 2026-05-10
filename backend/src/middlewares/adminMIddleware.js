import { USER_ROLE } from "../constants/enums.js";

// Dùng sau authMiddleware (req.user đã có)
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== USER_ROLE.ADMIN) {
    return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
  }
  next();
};

export default adminMiddleware;