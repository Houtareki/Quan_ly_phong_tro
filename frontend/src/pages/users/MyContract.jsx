import { useEffect, useState } from "react";
import { getMyRoom } from "./services/userService";

function MyContract() {
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let mounted = true;
    getMyRoom()
      .then((res) => {
        if (mounted) {
          console.log("MyContract - API response:", res);
          setRoom(res.data);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error("MyContract - Error:", err);
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <p>Đang tải...</p>;
  }

  if (error) {
    return <div className="alert alert-danger rounded-3">{error}</div>;
  }

  if (!room || !room.contract) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h3>Hợp đồng</h3>
        <p>Chưa có hợp đồng nào.</p>
      </div>
    );
  }

  const contract = room.contract;

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h3>Hợp đồng của tôi</h3>
      <div className="user-info-list">
        <p>
          <strong>Mã phòng:</strong> {room.roomCode}
        </p>
        <p>
          <strong>Ngày bắt đầu:</strong> {new Date(contract.startDate).toLocaleDateString("vi-VN")}
        </p>
        <p>
          <strong>Ngày kết thúc:</strong> {new Date(contract.endDate).toLocaleDateString("vi-VN")}
        </p>
        <p>
          <strong>Giá thuê:</strong> {contract.monthlyPrice?.toLocaleString("vi-VN")} VND/tháng
        </p>
        <p>
          <strong>Tiền đặt cọc:</strong> {contract.deposit?.toLocaleString("vi-VN")} VND
        </p>
      </div>

      {contract.contractImages && contract.contractImages.length > 0 ? (
        <div className="mt-4">
          <strong>Ảnh hợp đồng ({contract.contractImages.length}):</strong>
          <div className="mt-3 d-flex flex-wrap gap-2">
            {contract.contractImages.map((image, idx) => (
              <div key={idx} style={{ flex: "0 0 calc(50% - 0.5rem)", cursor: "pointer" }}>
                <img
                  src={image}
                  alt={`Ảnh hợp đồng ${idx + 1}`}
                  style={{ width: "100%", maxHeight: 300, objectFit: "contain", borderRadius: 8 }}
                  onClick={() => setSelectedImage(image)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="alert alert-secondary rounded-3 mt-3">
          Chưa có ảnh hợp đồng được tải lên.
        </div>
      )}

      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <img
              src={selectedImage}
              alt="Full screen"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyContract;
