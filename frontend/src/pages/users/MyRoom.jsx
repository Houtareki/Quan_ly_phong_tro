import { useEffect, useState } from "react";
import { getMyRoom } from "./services/userService";
import "./Style.css";

function MyRoom() {
  const [room, setRoom] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getMyRoom()
      .then((res) => {
        if (mounted) {
          setRoom(res.data);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-card">
      <h3>Phòng của tôi</h3>

      {error && <div className="alert">{error}</div>}

      {!room ? (
        <div className="empty">
          <div className="icon">🏠</div>
          <p>Chưa có phòng</p>
        </div>
      ) : (
        <div className="user-info-list">
          <p>
            <strong>Mã phòng:</strong> {room.roomCode}
          </p>
          <p>
            <strong>Loại phòng:</strong> {room.roomType}
          </p>
          <p>
            <strong>Diện tích:</strong> {room.area || 0} m2
          </p>
          <p>
            <strong>Giá thuê:</strong>{" "}
            {(
              room.contract?.monthlyPrice ||
              room.defaultPrice ||
              0
            ).toLocaleString("vi-VN")}{" "}
            VND
          </p>
          <p>
            <strong>Trạng thái:</strong> {room.status}
          </p>
        </div>
      )}
    </div>
  );
}

export default MyRoom;
