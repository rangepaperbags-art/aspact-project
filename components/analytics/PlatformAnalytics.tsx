// components/analytics/PlatformAnalytics.tsx
'use client';

import { PerformanceMetric } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface PlatformAnalyticsProps {
  data: PerformanceMetric[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function PlatformAnalytics({ data }: PlatformAnalyticsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white p-2 rounded-sm shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Platform Performance Metrics
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'CTR') return [`${Number(value).toFixed(2)}%`, name];
                if (name === 'Average Spend') return [formatCurrency(Number(value)), name];
                if (name === 'CPM') return [formatCurrency(Number(value)), name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="ctr" name="CTR (%)" fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
            <Bar yAxisId="right" dataKey="averageSpend" name="Average Spend" fill="#82ca9d">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="text-center p-4 bg-blue-50 rounded-sm">
          <div className="text-2xl font-bold text-blue-600">
            {Math.max(...data.map(d => d.ctr)).toFixed(2)}%
          </div>
          <div className="text-sm text-blue-800">Highest CTR</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-sm">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(Math.max(...data.map(d => d.averageSpend)))}
          </div>
          <div className="text-sm text-green-800">Highest Avg Spend</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-sm">
          <div className="text-2xl font-bold text-purple-600">
            {data.length}
          </div>
          <div className="text-sm text-purple-800">Platforms Tracked</div>
        </div>
      </div>
    </div>
  );
}