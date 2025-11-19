// components/analytics/StrategicInsights.tsx
'use client';

import { Ad, AnalyticsData, PlatformDistribution, PerformanceMetric } from '@/types';

interface StrategicInsightsProps {
  ads: Ad[];
  analytics: AnalyticsData | null;
}

export default function StrategicInsights({ ads, analytics }: StrategicInsightsProps) {
  // Calculate insights with proper error handling
  const insights = {
    topPerformingPlatform: analytics?.platformDistribution?.reduce((max: PlatformDistribution | null, platform) => {
      if (!max || platform.spend > max.spend) return platform;
      return max;
    }, null as PlatformDistribution | null),
    
    mostEfficientPlatform: analytics?.performanceMetrics?.reduce((max: PerformanceMetric | null, metric) => {
      if (!max || metric.ctr > max.ctr) return metric;
      return max;
    }, null as PerformanceMetric | null),
    
    totalSuperPacs: new Set(ads.map(ad => ad.superPAC.name)).size,
    averageAdSpend: analytics?.totalSpend && ads.length > 0 ? analytics.totalSpend / ads.length : 0,
    spendingVelocity: calculateSpendingVelocity(ads, analytics),
    platformPreferences: calculatePlatformPreferences(ads),
  };

  function calculateSpendingVelocity(ads: Ad[], analytics: AnalyticsData | null): string {
    if (ads.length === 0 || !analytics?.totalSpend) return 'No data';
    
    const sortedAds = [...ads].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    const timeRange = new Date(sortedAds[sortedAds.length - 1].startDate).getTime() - 
                     new Date(sortedAds[0].startDate).getTime();
    const days = Math.max(timeRange / (1000 * 60 * 60 * 24), 1);
    const dailySpend = analytics.totalSpend / days;
    
    return `$${dailySpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day`;
  }

  function calculatePlatformPreferences(ads: Ad[]): { pac: string; platform: string; spend: number }[] {
    if (ads.length === 0) return [];
    
    const pacPlatformSpend = ads.reduce((acc, ad) => {
      const key = `${ad.superPAC.name}-${ad.platform.name}`;
      if (!acc[key]) {
        acc[key] = {
          pac: ad.superPAC.name,
          platform: ad.platform.name,
          spend: 0
        };
      }
      acc[key].spend += ad.spend;
      return acc;
    }, {} as Record<string, { pac: string; platform: string; spend: number }>);

    return Object.values(pacPlatformSpend)
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 5);
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white p-6 rounded-sm shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Strategic Insights & Analysis
      </h2>
      
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-sm">
            <h3 className="font-semibold text-blue-900 mb-2">Top Spending Platform</h3>
            <div className="text-2xl font-bold text-blue-600">
              {insights.topPerformingPlatform?.platform || 'N/A'}
            </div>
            <div className="text-sm text-blue-800">
              {insights.topPerformingPlatform ? 
                formatCurrency(insights.topPerformingPlatform.spend) : 'No data'}
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-sm">
            <h3 className="font-semibold text-green-900 mb-2">Most Efficient Platform</h3>
            <div className="text-2xl font-bold text-green-600">
              {insights.mostEfficientPlatform?.platform || 'N/A'}
            </div>
            <div className="text-sm text-green-800">
              {insights.mostEfficientPlatform ? 
                `${insights.mostEfficientPlatform.ctr.toFixed(2)}% CTR` : 'No data'}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-sm">
            <h3 className="font-semibold text-purple-900 mb-2">Spending Velocity</h3>
            <div className="text-2xl font-bold text-purple-600">
              {insights.spendingVelocity}
            </div>
            <div className="text-sm text-purple-800">Average Daily Spend</div>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-sm">
            <h3 className="font-semibold text-orange-900 mb-2">Campaign Scale</h3>
            <div className="text-2xl font-bold text-orange-600">
              {insights.totalSuperPacs}
            </div>
            <div className="text-sm text-orange-800">Super PACs Tracked</div>
          </div>
        </div>
      </div>

      {/* Platform Preferences */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-900 mb-3">Platform Preferences by Super PAC</h3>
        <div className="space-y-2">
          {insights.platformPreferences.length > 0 ? (
            insights.platformPreferences.map((pref, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-sm">
                <div>
                  <span className="font-medium text-gray-900">{pref.pac}</span>
                  <span className="text-gray-600 mx-2">→</span>
                  <span className="text-blue-600">{pref.platform}</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {formatCurrency(pref.spend)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No platform preference data available
            </div>
          )}
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-sm border-yellow-200">
        <h3 className="font-semibold text-yellow-900 mb-2">Strategic Recommendations</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Monitor {insights.topPerformingPlatform?.platform || 'key platforms'} for high-impact campaigns</li>
          <li>• Leverage {insights.mostEfficientPlatform?.platform || 'efficient platforms'} for cost-effective outreach</li>
          <li>• Analyze platform-specific audience targeting strategies</li>
          <li>• Track spending patterns for regulatory compliance</li>
        </ul>
      </div>
    </div>
  );
}