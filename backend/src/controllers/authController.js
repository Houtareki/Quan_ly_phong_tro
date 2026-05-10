import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { USER_ROLE } from "../constants/enums.js";

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  const { username, password, fullname, phone, email, cccd, role } = req.body;

  if (!username || !password || !fullname) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin bắt buộc" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Chỉ cho phép đăng ký role TENANT hoặc LANDLORD
  // ADMIN chỉ được tạo thủ công hoặc qua trang admin
  const allowedRoles = [USER_ROLE.TENANT, USER_ROLE.LANDLORD];
  const userRole = allowedRoles.includes(role) ? role : USER_ROLE.TENANT;

  const newUser = await User.create({
    username,
    password: hashedPassword,
    fullname,
    phone,
    email,
    cccd,
    role: userRole,
  });

  const token = generateToken(newUser._id);

  res.status(201).json({
    message: "Đăng ký thành công",
    token,
    user: {
      _id: newUser._id,
      username: newUser.username,
      fullname: newUser.fullname,
      role: newUser.role,
      email: newUser.email,
      phone: newUser.phone,
      isActive: newUser.isActive,
    },
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập và mật khẩu" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
  }

  if (!user.isActive) {
    return res.status(403).json({ message: "Tài khoản đã bị khoá. Vui lòng liên hệ admin" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
  }

  const token = generateToken(user._id);

  res.json({
    message: "Đăng nhập thành công",
    token,
    user: {
      _id: user._id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
    },
  });
};

// GET /api/auth/me  (cần authMiddleware)
export const getMe = async (req, res) => {
  // req.user đã được gắn bởi authMiddleware
  res.json({ user: req.user });
};