import React from 'react';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCurrency } from '../contexts/CurrencyContext';

interface EquityChartProps {
  data: { name: string; value: number }[];
}

const EquityChart: React.FC<EquityChartProps> = ({ data }) => {
  const { convert } = useCurrency();
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 10,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="#A0AEC0" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${convert(0).symbol}${(value as number / 1000).toFixed(0)}k`} 
            domain={['dataMin - 1000', 'dataMax + 1000']} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2D3748', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#E2E8F0' }}
            formatter={(value: number) => [`${convert(value).symbol}${convert(value).formatted}`, 'Equity']}
          />
          <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquityChart;