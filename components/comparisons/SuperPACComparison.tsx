// components/comparisons/SuperPACComparison.tsx
'use client';

import { Ad } from '@/types';
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

interface SuperPACComparisonProps {
  ads: Ad[];
}

export default function SuperPACComparison({ ads }: SuperPACComparisonProps) {
  // Aggregate data by Super PAC and Platform with proper initial value
  const comparisonData = ads.reduce((acc, ad) => {
    const { superPAC, platform, spend } = ad;
    
    let pacData = acc.find(item => item.superPAC === superPAC.name);
    if (!pacData) {
      pacData = { superPAC: superPAC.name, totalSpend: 0 };
      acc.push(pacData);
    }
    
    pacData.totalSpend += spend;
    
    // Add platform-specific spending
    if (!pacData[platform.name]) {
      pacData[platform.name] = 0;
    }
    pacData[platform.name] += spend;
    
    return acc;
  }, [] as any[]);

  // Get all unique platforms for the chart
  const platforms = [...new Set(ads.map(ad => ad.platform.name))];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (ads.length === 0) {
    return (
      <div className="bg-white p-6 rounded-sm shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Super PAC Spending Comparison
        </h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No ad data available for comparison
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 rounded-sm shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Super PAC Spending Comparison
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="superPAC" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Spend']} />
            <Legend />
            {platforms.map((platform, index) => (
              <Bar
                key={platform}
                dataKey={platform}
                name={platform}
                fill={COLORS[index % COLORS.length]}
                stackId="a"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {comparisonData.map((pac, index) => (
          <div key={pac.superPAC} className="p-4 rounded-sm">
            <h3 className="font-semibold text-gray-900 mb-2">{pac.superPAC}</h3>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(pac.totalSpend)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Spending</div>
            
            {/* Platform breakdown */}
            <div className="mt-3 space-y-1">
              {platforms.map(platform => (
                pac[platform] > 0 && (
                  <div key={platform} className="flex justify-between text-sm">
                    <span className="text-gray-600">{platform}:</span>
                    <span className="font-medium">
                      {formatCurrency(pac[platform])}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];