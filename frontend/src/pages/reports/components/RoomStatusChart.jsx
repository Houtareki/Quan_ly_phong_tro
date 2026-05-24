import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const RoomStatusChart = ({ roomSummary }) => {
  const data = [
    {
      name: "Phòng trống",
      value: roomSummary.emptyRooms,
      color: "#dff3ea",
    },
    {
      name: "Đang thuê",
      value: roomSummary.rentedRooms,
      color: "#0f8f68",
    },
    {
      name: "Bảo trì",
      value: roomSummary.maintenanceRooms,
      color: "#f59e0b",
    },
  ];
  return (
    <section className="report-card">
      <h6 className="report-card-title">Tình trạng phòng</h6>

      <div className="room-pie-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={78}
              outerRadius={108}
              paddingAngle={2}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="room-pie-center">
          <strong>{roomSummary.totalRooms}</strong>
          <span>phòng</span>
        </div>
      </div>

      <div className="room-status-legend">
        {data.map((item) => (
          <div className="legend-item" key={item.name}>
            <span
              className="legend-dot"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.name}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomStatusChart;
