export const ROOM_STATUS_LABELS = {
  AVAILABLE: "Còn trống",
  RENTED: "Đang thuê",
  MAINTENANCE: "Bảo trì",
};

export const getRoomStatusLabel = (status) => ROOM_STATUS_LABELS[status] || status;
