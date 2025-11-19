// components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { AnalyticsData, Ad } from '@/types';
import PlatformAnalytics from '@/components/analytics/PlatformAnalytics';
import SpendingMatrix from '@/components/analytics/SpendingMatrix';
import AdLibrary from '@/components/ads/AdLibrary';
import PlatformDistribution from '@/components/analytics/PlatformDistribution';
import SuperPACComparison from '@/components/comparisons/SuperPACComparison';
import SpendingTrends from '@/components/analytics/SpendingTrends';
import StrategicInsights from '@/components/analytics/StrategicInsights';
import PlatformFilters from '@/components/filters/PlatformFilters';
import SyncButton from '@/components/sync/SyncButton';
import SuperPACSpendingBreakdown from '@/components/breakdowns/SuperPACSpendingBreakdown';
import { mockAds, mockAnalytics } from '@/lib/mockData';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadMockData();
  }, []);

  useEffect(() => {
    filterAds();
  }, [ads, selectedPlatforms]);

  const loadMockData = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setAds(mockAds);
      setFilteredAds(mockAds);
      setLoading(false);
    }, 1000);
  };

  const handleSync = async () => {
    setSyncing(true);
    // Simulate API sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    loadMockData();
    setSyncing(false);
  };

  const filterAds = () => {
    if (selectedPlatforms.length === 0) {
      setFilteredAds(ads);
    } else {
      setFilteredAds(ads.filter(ad => 
        selectedPlatforms.includes(ad.platform.name)
      ));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading political spending data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Responsive */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  AI Political Spending Tracker
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Tracking OpenAI + Andreessen Horowitz (a16z) and Meta Platforms Inc. Super PAC spending
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <PlatformFilters
                selectedPlatforms={selectedPlatforms}
                onPlatformsChange={setSelectedPlatforms}
              />
              <SyncButton onSync={handleSync} syncing={syncing} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Overview Cards - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">Total Spending</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">
              ${analytics?.totalSpend.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">Total Impressions</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
              {analytics?.totalImpressions.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">Total Ads</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 mt-1 sm:mt-2">
              {ads.length.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-sm shadow-sm">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">Platforms</h3>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mt-1 sm:mt-2">
              {new Set(ads.map(ad => ad.platform.name)).size}
            </p>
          </div>
        </div>

        {/* Charts Grid - Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <PlatformDistribution data={analytics?.platformDistribution || []} />
          <SpendingTrends data={analytics?.spendingTrends || []} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <SuperPACSpendingBreakdown />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <SpendingMatrix data={analytics} />
          <SuperPACComparison ads={ads} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <PlatformAnalytics data={analytics?.performanceMetrics || []} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="xl:col-span-2">
            <StrategicInsights ads={ads} analytics={analytics} />
          </div>
          <div className="xl:col-span-1">
            {/* Additional insights or metrics can go here */}
          </div>
        </div>

        {/* Ad Library */}
        <div className="mb-6 sm:mb-8">
          <AdLibrary ads={filteredAds} />
        </div>
      </main>
    </div>
  );
}