// Script hash lại password cũ (plain text) trong database
// Chạy 1 lần duy nhất: node src/scripts/hashExistingPasswords.js

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../configs/db.js";
import User from "../models/User.js";

dotenv.config();

const hashExistingPasswords = async () => {
  await connectDB();

  const users = await User.find({});
  let count = 0;

  for (const user of users) {
    // Bcrypt hash luôn bắt đầu bằng $2b$ hoặc $2a$
    // Nếu password KHÔNG bắt đầu như vậy → chưa hash → cần hash
    const isAlreadyHashed =
      user.password.startsWith("$2b$") || user.password.startsWith("$2a$");

    if (!isAlreadyHashed) {
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      console.log(`✅ Đã hash password của user: ${user.username}`);
      count++;
    }
  }

  if (count === 0) {
    console.log("Tất cả password đã được hash rồi, không cần làm gì.");
  } else {
    console.log(`\nHoàn thành! Đã hash ${count} tài khoản.`);
  }

  process.exit(0);
};

hashExistingPasswords().catch((err) => {
  console.error("Lỗi:", err);
  process.exit(1);
});