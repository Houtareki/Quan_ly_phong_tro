const RoomSelector = ({
  roomOptions,
  roomId,
  error,
  onChange,
  getSelectClass,
}) => {
  return (
    <div className="mb-4">
      <label className="form-label fw-bold">Chọn phòng</label>

      <select
        name="roomId"
        className={getSelectClass("roomId")}
        value={roomId}
        onChange={onChange}
      >
        {roomOptions.map((room) => (
          <option key={room.id} value={room.id}>
            {room.roomName} - {room.tenantName}
          </option>
        ))}
      </select>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default RoomSelector;
