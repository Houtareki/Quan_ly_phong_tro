import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserActive,
  deleteUser,
  getPendingRooms,
  approveRoom,
  rejectRoom,
  getStats,
} from "../controllers/adminController.js";

const router = express.Router();

// Tất cả route admin đều phải đăng nhập + là ADMIN
router.use(authMiddleware, adminMiddleware);

// ── Thống kê ────────────────────────────────────────
// GET /api/admin/stats
router.get("/stats", getStats);

// ── Quản lý user ────────────────────────────────────
// GET    /api/admin/users          – danh sách user (có filter, search, pagination)
// POST   /api/admin/users          – tạo user mới
router.route("/users").get(getUsers).post(createUser);

// GET    /api/admin/users/:id      – chi tiết user
// PUT    /api/admin/users/:id      – cập nhật thông tin user
// DELETE /api/admin/users/:id      – xoá user
router.route("/users/:id").get(getUserById).put(updateUser).delete(deleteUser);

// PATCH  /api/admin/users/:id/toggle-active  – khoá / mở khoá
router.patch("/users/:id/toggle-active", toggleUserActive);

// ── Duyệt bài phòng ─────────────────────────────────
// GET   /api/admin/rooms/pending   – danh sách phòng chờ duyệt
router.get("/rooms/pending", getPendingRooms);

// PATCH /api/admin/rooms/:id/approve  – duyệt phòng
router.patch("/rooms/:id/approve", approveRoom);

// PATCH /api/admin/rooms/:id/reject   – từ chối duyệt phòng
router.patch("/rooms/:id/reject", rejectRoom);

export default router;