// components/analytics/PlatformDistribution.tsx
'use client';

import { PlatformDistribution } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PlatformDistributionProps {
  data: PlatformDistribution[];
}

export default function PlatformDistributionChart({ data }: PlatformDistributionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Sort data by spend for better visualization
  const sortedData = [...data].sort((a, b) => b.spend - a.spend);

  return (
    <div className="bg-white p-4 rounded-sm shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Platform Spending Distribution
      </h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 p-3 rounded-sm">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(data.reduce((sum, item) => sum + item.spend, 0))}
          </div>
          <div className="text-xs text-blue-800">Total Platform Spend</div>
        </div>
        <div className="bg-green-50 p-3 rounded-sm">
          <div className="text-2xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.adCount, 0)}
          </div>
          <div className="text-xs text-green-800">Total Ads</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-sm">
          <div className="text-2xl font-bold text-purple-600">
            {data.length}
          </div>
          <div className="text-xs text-purple-800">Platforms</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-sm">
          <div className="text-2xl font-bold text-orange-600">
            {Math.max(...data.map(d => d.percentage)).toFixed(1)}%
          </div>
          <div className="text-xs text-orange-800">Top Platform Share</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="platform" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              fontSize={12}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'spend') return [formatCurrency(Number(value)), 'Spend'];
                if (name === 'adCount') return [value, 'Ad Count'];
                return [value, name];
              }}
              labelFormatter={(label) => `Platform: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="spend" 
              name="Total Spend" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="adCount" 
              name="Ad Count" 
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Details Table */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-900 mb-3">Platform Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ads
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Spend/Ad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item, index) => (
                <tr key={item.platform} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.platform}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.spend)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      {item.percentage.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.adCount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.spend / item.adCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}