import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register  – đăng ký tài khoản mới
router.post("/register", register);

// POST /api/auth/login  – đăng nhập
router.post("/login", login);

// GET  /api/auth/me  – lấy thông tin user đang đăng nhập (cần token)
router.get("/me", authMiddleware, getMe);

export default router;