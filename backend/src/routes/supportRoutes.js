import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { USER_ROLE } from "../constants/enums.js";
import { getSupportRequests, markSupportRequestRead } from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware);

const landlordOrAdminMiddleware = (req, res, next) => {
  if (![USER_ROLE.ADMIN, USER_ROLE.LANDLORD].includes(req.user.role)) {
    return res.status(403).json({ message: "Chỉ chủ trọ mới có quyền truy cập" });
  }
  next();
};

router.use(landlordOrAdminMiddleware);

router.get("/requests", getSupportRequests);
router.patch("/requests/:id/read", markSupportRequestRead);

export default router;
