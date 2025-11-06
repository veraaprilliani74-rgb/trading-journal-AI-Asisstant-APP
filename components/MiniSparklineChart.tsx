import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface MiniSparklineChartProps {
  data: { name: string; price: number }[];
  color: string;
}

const MiniSparklineChart: React.FC<MiniSparklineChartProps> = ({ data, color }) => {
  const gradientId = `color-${Math.random().toString(36).substring(7)}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 2,
          right: 0,
          left: 0,
          bottom: 2,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default MiniSparklineChart;
