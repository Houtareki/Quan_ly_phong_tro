// Script tạo tài khoản admin mặc định
// Chạy: node src/scripts/seedAdmin.js

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../configs/db.js";
import User from "../models/User.js";
import { USER_ROLE } from "../constants/enums.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("Tài khoản admin đã tồn tại, bỏ qua.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    username: "admin",
    password: hashedPassword,
    fullname: "Quản trị viên",
    role: USER_ROLE.ADMIN,
    isActive: true,
  });

  console.log("Đã tạo tài khoản admin:");
  console.log("  Username: admin");
  console.log("  Password: admin123");
  console.log("⚠️  Nhớ đổi mật khẩu sau khi chạy lần đầu!");
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});