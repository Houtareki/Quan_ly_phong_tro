import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../../utils/formatCurrency";

const RevenueChartCard = ({ data }) => {
  return (
    <section className="report-card">
      <h6 className="report-card-title">Doanh thu 6 tháng gần nhất</h6>
      <div className="chart-box large">
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f8f68" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0f8f68" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2f0" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ dy: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              width={80}
            />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0f8f68"
              strokeWidth={3}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default RevenueChartCard;
