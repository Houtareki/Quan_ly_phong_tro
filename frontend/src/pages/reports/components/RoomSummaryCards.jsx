const RoomSummaryCards = ({ roomSummary }) => {
  const cards = [
    {
      label: "Tổng phòng",
      value: roomSummary.totalRooms,
      icon: "bi bi-house-door-fill",
      className: "solid",
    },
    {
      label: "Đang thuê",
      value: roomSummary.rentedRooms,
      icon: "bi bi-people-fill",
      className: "pale",
    },
    {
      label: "Bảo trì",
      value: roomSummary.maintenanceRooms,
      icon: "bi bi-tools",
      className: "warning",
    },
    {
      label: "Phòng trống",
      value: roomSummary.emptyRooms,
      icon: "bi bi-door-open",
      className: "empty",
    },
  ];

  return (
    <div className="report-summary-grid mt-3">
      {cards.map((card) => (
        <div className="report-card metric-card" key={card.label}>
          <div className={`metric-icon ${card.className}`}>
            <i className={card.icon}></i>
          </div>
          <div className="metric-number">{card.value}</div>
          <div className="metric-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

export default RoomSummaryCards;
