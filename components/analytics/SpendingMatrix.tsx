// components/analytics/SpendingMatrix.tsx
'use client';

import { AnalyticsData } from '@/types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SpendingMatrixProps {
  data: AnalyticsData | null;
}

export default function SpendingMatrix({ data }: SpendingMatrixProps) {
  // Transform data for scatter plot
  const scatterData = data?.platformDistribution.map(item => ({
    platform: item.platform,
    spend: item.spend,
    adCount: item.adCount,
    efficiency: item.spend / item.adCount, // Spend per ad
  })) || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white p-4 rounded-sm shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Spending Matrix & Efficiency
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="adCount" 
              name="Ad Count"
              label={{ value: 'Number of Ads', position: 'bottomleft', offset: 0 }}
            />
            <YAxis 
              type="number" 
              dataKey="spend" 
              name="Total Spend"
              label={{ value: 'Total Spend($)', angle: -90, position: 'left', offset: 2 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <ZAxis 
              type="number" 
              dataKey="efficiency" 
              range={[50, 500]} 
              name="Efficiency"
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'spend') return [formatCurrency(Number(value)), 'Total Spend'];
                if (name === 'efficiency') return [formatCurrency(Number(value)), 'Spend per Ad'];
                return [value, name];
              }}
              labelFormatter={(label) => `Platform: ${label}`}
            />
            <Legend />
            <Scatter name="Platforms" data={scatterData} fill="#8884d8">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {/* Insights */}
      <div className="mt-4 p-2 bg-gray-50 rounded-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Matrix Insights</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Larger bubbles indicate higher spend per ad efficiency</li>
          <li>• Right-positioned platforms have more ad volume</li>
          <li>• Higher positioned platforms have greater total spending</li>
        </ul>
      </div>
    </div>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];