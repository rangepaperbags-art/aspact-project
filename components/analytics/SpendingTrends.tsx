// components/analytics/SpendingTrends.tsx
'use client';

import { SpendingTrend } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SpendingTrendsProps {
  data: SpendingTrend[];
}

export default function SpendingTrends({ data }: SpendingTrendsProps) {
  // Group data by date for time series with proper initial value
  const timeSeriesData = data.reduce((acc, trend) => {
    const existingDate = acc.find(item => item.date === trend.date);
    if (existingDate) {
      existingDate[trend.superPAC] = (existingDate[trend.superPAC] || 0) + trend.spend;
      existingDate.total = (existingDate.total || 0) + trend.spend;
    } else {
      const newDate: any = { date: trend.date, total: trend.spend };
      newDate[trend.superPAC] = trend.spend;
      acc.push(newDate);
    }
    return acc;
  }, [] as any[]);

  // Get unique Super PACs for lines
  const superPacs = [...new Set(data.map(trend => trend.superPAC))];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-sm shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Spending Trends Over Time
        </h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No trend data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-sm shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Spending Trends Over Time
      </h2>
      <div className="h-80 space-y-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timeSeriesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Spend']} />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Spending"
              stroke="#8884d8"
              strokeWidth={3}
              dot={false}
            />
            {superPacs.map((pac, index) => (
              <Line
                key={pac}
                type="monotone"
                dataKey={pac}
                name={pac}
                stroke={COLORS[(index + 1) % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Trend Analysis */}
      <div className="mt-4 p-4 bg-gray-50 rounded-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Trend Analysis</h3>
        <div className="text-sm text-gray-600">
          {data.length > 0 ? (
            <div className="space-y-1">
              <div>• Tracking {timeSeriesData.length} days of spending data</div>
              <div>• Monitoring {superPacs.length} Super PACs</div>
              <div>• Total period: {timeSeriesData[0]?.date} to {timeSeriesData[timeSeriesData.length - 1]?.date}</div>
            </div>
          ) : (
            <div>No trend data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];