const OccupancyRateCard = ({ roomSummary }) => {
  const occupancyRate = Number(roomSummary.occupancyRate || 0);

  return (
    <section className="report-card">
      <h6 className="report-card-title">Tỷ lệ lấp đầy</h6>

      <div className="occupancy-bar">
        <div
          className="occupancy-bar-fill"
          style={{ width: `${occupancyRate}%` }}
        />
      </div>

      <div className="mt-2 text-muted">
        {occupancyRate}% ({roomSummary.rentedRooms}/{roomSummary.totalRooms}{" "}
        phòng)
      </div>
    </section>
  );
};

export default OccupancyRateCard;
