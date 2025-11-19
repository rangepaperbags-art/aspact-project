// components/breakdowns/SuperPACSpendingBreakdown.tsx
'use client';

import { useState } from 'react';
import { SpendingBreakdown } from '@/types';
import { mockSpendingBreakdown } from '@/lib/mockData';

export default function SuperPACSpendingBreakdown() {
  const [selectedPAC, setSelectedPAC] = useState<SpendingBreakdown>(mockSpendingBreakdown[0]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-sm shadow-sm border">
      <div className="p-4 sm:p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          Super PAC Spending Breakdown
        </h2>
        <p className="text-gray-600 mt-1 text-sm">
          Detailed analysis of political advertising spending across platforms
        </p>
      </div>

      {/* Super PAC Selector */}
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-wrap gap-2">
          {mockSpendingBreakdown.map((breakdown) => (
            <button
              key={breakdown.superPAC.id}
              onClick={() => setSelectedPAC(breakdown)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                selectedPAC.superPAC.id === breakdown.superPAC.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {breakdown.superPAC.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Super PAC Header */}
        <div className="mb-6 p-4 bg-gray-50 rounded-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedPAC.superPAC.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {selectedPAC.superPAC.legalName}
          </p>
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium">Funding Organization:</span>{' '}
              <span className="text-blue-600">{selectedPAC.superPAC.fundingOrganization}</span>
            </div>
            <div>
              <span className="font-medium">FEC ID:</span>{' '}
              <span className="text-gray-700">{selectedPAC.superPAC.fecCommitteeId}</span>
            </div>
            <div>
              <span className="font-medium">Total Spend:</span>{' '}
              <span className="text-green-600 font-semibold">
                {formatCurrency(selectedPAC.totalSpend)}
              </span>
            </div>
          </div>
        </div>

        {/* Platform Spending Breakdown */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Spending Distribution
          </h4>
          <div className="space-y-3">
            {selectedPAC.platformSpend.map((platformSpend, index) => (
              <div key={platformSpend.platform.id} className="flex items-center justify-between p-3 bg-white border rounded-sm">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-gray-900 min-w-[120px]">
                    {platformSpend.platform.name}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${platformSpend.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right min-w-[100px]">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(platformSpend.spend)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {platformSpend.percentage.toFixed(1)}% • {platformSpend.adCount} ads
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEC Filings */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Federal Election Commission Filings
          </h4>
          <div className="space-y-3">
            {selectedPAC.fecFilings.map((filing) => (
              <div key={filing.id} className="p-4 border rounded-sm hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {filing.report_type} - {filing.form_type}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {filing.purpose}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Filed: {filing.date} • Transaction: {filing.transaction_type}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:text-right">
                    <div className="font-semibold text-green-600">
                      {formatCurrency(filing.amount)}
                    </div>
                    <a
                      href={filing.fec_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View on FEC.gov →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Ads */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Ads
          </h4>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedPAC.topAds.map((ad) => (
              <div key={ad.id} className="border rounded-sm overflow-hidden hover:shadow-md transition-shadow">
                {ad.thumbnail && (
                  <img
                    src={ad.thumbnail}
                    alt={ad.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-3">
                  <h5 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {ad.title}
                  </h5>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {ad.description}
                  </p>
                  <div className="mt-2 flex justify-between items-center text-xs">
                    <span className="text-gray-500">{ad.platform.name}</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(ad.spend)}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>CTR: {((ad.clicks / ad.impressions) * 100).toFixed(1)}%</span>
                    <span>{ad.impressions.toLocaleString()} impressions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}