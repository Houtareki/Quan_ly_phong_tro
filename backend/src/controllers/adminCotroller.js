import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Contract from "../models/Contract.js";
import Invoice from "../models/Invoice.js";
import { USER_ROLE, ROOM_STATUS, CONTRACT_STATUS, INVOICE_STATUS } from "../constants/enums.js";

// ─── QUẢN LÝ USER ──────────────────────────────────────────────────────────────

// GET /api/admin/users
// Lấy danh sách tất cả user, hỗ trợ filter theo role và search theo tên/username
export const getUsers = async (req, res) => {
  const { role, search, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { fullname: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy user" });
  }
  res.json({ user });
};

// POST /api/admin/users
// Admin tạo user mới (có thể tạo cả ADMIN)
export const createUser = async (req, res) => {
  const { username, password, fullname, phone, email, cccd, role } = req.body;

  if (!username || !password || !fullname) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin bắt buộc" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    password: hashedPassword,
    fullname,
    phone,
    email,
    cccd,
    role: role || USER_ROLE.TENANT,
  });

  res.status(201).json({
    message: "Tạo user thành công",
    user: { ...newUser.toObject(), password: undefined },
  });
};

// PUT /api/admin/users/:id
// Admin cập nhật thông tin user (không đổi mật khẩu ở đây)
export const updateUser = async (req, res) => {
  const { fullname, phone, email, cccd, role } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy user" });
  }

  if (fullname !== undefined) user.fullname = fullname;
  if (phone !== undefined) user.phone = phone;
  if (email !== undefined) user.email = email;
  if (cccd !== undefined) user.cccd = cccd;
  if (role !== undefined) user.role = role;

  await user.save();
  const updated = user.toObject();
  delete updated.password;

  res.json({ message: "Cập nhật thành công", user: updated });
};

// PATCH /api/admin/users/:id/toggle-active
// Khoá hoặc mở khoá tài khoản user
export const toggleUserActive = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy user" });
  }

  // Không cho khoá chính mình
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "Không thể khoá tài khoản của chính mình" });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    message: user.isActive ? "Đã mở khoá tài khoản" : "Đã khoá tài khoản",
    isActive: user.isActive,
  });
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy user" });
  }
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: "Không thể xoá tài khoản của chính mình" });
  }

  await user.deleteOne();
  res.json({ message: "Đã xoá user thành công" });
};

// ─── DUYỆT BÀI PHÒNG ───────────────────────────────────────────────────────────

// GET /api/admin/rooms/pending
// Lấy danh sách phòng chờ duyệt (isApproved = false)
export const getPendingRooms = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = { isApproved: false };
  const total = await Room.countDocuments(filter);
  const rooms = await Room.find(filter)
    .populate("landlordId", "fullname username phone")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    rooms,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

// PATCH /api/admin/rooms/:id/approve
// Duyệt phòng
export const approveRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    return res.status(404).json({ message: "Không tìm thấy phòng" });
  }
  if (room.isApproved) {
    return res.status(400).json({ message: "Phòng đã được duyệt rồi" });
  }

  room.isApproved = true;
  room.approvalNote = "";
  await room.save();

  res.json({ message: "Đã duyệt phòng thành công", room });
};

// PATCH /api/admin/rooms/:id/reject
// Từ chối duyệt phòng (kèm lý do)
export const rejectRoom = async (req, res) => {
  const { note } = req.body;
  const room = await Room.findById(req.params.id);
  if (!room) {
    return res.status(404).json({ message: "Không tìm thấy phòng" });
  }

  // Xoá phòng khỏi DB khi từ chối,
  // hoặc nếu muốn giữ lại lịch sử thì đổi thành gắn note
  room.approvalNote = note || "Không đạt yêu cầu";
  await room.deleteOne();

  res.json({ message: "Đã từ chối và xoá bài đăng phòng" });
};

// ─── THỐNG KÊ ──────────────────────────────────────────────────────────────────

// GET /api/admin/stats
// Thống kê tổng quan cho trang dashboard admin
export const getStats = async (req, res) => {
  const [
    totalUsers,
    totalAdmins,
    totalLandlords,
    totalTenants,
    totalRooms,
    availableRooms,
    rentedRooms,
    maintenanceRooms,
    pendingRooms,
    activeContracts,
    totalInvoices,
    unpaidInvoices,
    overdueInvoices,
    paidInvoices,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: USER_ROLE.ADMIN }),
    User.countDocuments({ role: USER_ROLE.LANDLORD }),
    User.countDocuments({ role: USER_ROLE.TENANT }),
    Room.countDocuments({ isApproved: true }),
    Room.countDocuments({ isApproved: true, status: ROOM_STATUS.AVAILABLE }),
    Room.countDocuments({ isApproved: true, status: ROOM_STATUS.RENTED }),
    Room.countDocuments({ isApproved: true, status: ROOM_STATUS.MAINTENANCE }),
    Room.countDocuments({ isApproved: false }),
    Contract.countDocuments({ status: CONTRACT_STATUS.ACTIVE }),
    Invoice.countDocuments(),
    Invoice.countDocuments({ status: INVOICE_STATUS.UNPAID }),
    Invoice.countDocuments({ status: INVOICE_STATUS.OVERDUE }),
    Invoice.countDocuments({ status: INVOICE_STATUS.PAID }),
  ]);

  // Tổng doanh thu từ hoá đơn đã thanh toán
  const revenueResult = await Invoice.aggregate([
    { $match: { status: INVOICE_STATUS.PAID } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Doanh thu theo tháng (6 tháng gần nhất)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const revenueByMonth = await Invoice.aggregate([
    {
      $match: {
        status: INVOICE_STATUS.PAID,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json({
    users: { total: totalUsers, admin: totalAdmins, landlord: totalLandlords, tenant: totalTenants },
    rooms: {
      total: totalRooms,
      available: availableRooms,
      rented: rentedRooms,
      maintenance: maintenanceRooms,
      pendingApproval: pendingRooms,
    },
    contracts: { active: activeContracts },
    invoices: {
      total: totalInvoices,
      unpaid: unpaidInvoices,
      overdue: overdueInvoices,
      paid: paidInvoices,
    },
    revenue: { total: totalRevenue, byMonth: revenueByMonth },
  });
};