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

import User from "../models/User.js";
import bcrypt from "bcryptjs";

// API lấy toàn bộ tài khoản trong database
router.get("/debug-users", async (req, res) => {
  try {
    const users = await User.find({}, "username fullname role email phone");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API reset mật khẩu của một tài khoản thành 123456
router.post("/debug-reset-password", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const hashedPassword = await bcrypt.hash("123456", 10);
    user.password = hashedPassword;
    await user.save();

    res.json({
      message: `Đã đặt lại mật khẩu cho tài khoản "${username}" thành 123456`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
