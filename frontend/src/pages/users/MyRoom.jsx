import { useEffect, useState } from "react";
import { getMyRoom } from "../reports/services/userService";
import "./Style.css"

function MyRoom() {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    getMyRoom().then(res => setRoom(res.data));
  }, []);

  if (!room) return <p>Loading...</p>;

  return (
    <div className="user-card">
      <h3>Phòng của tôi</h3>

      <div className="empty">
        <div className="icon">🏠</div>
        <p>Chưa có phòng</p>
      </div>
    </div>
  );
}

export default MyRoom;