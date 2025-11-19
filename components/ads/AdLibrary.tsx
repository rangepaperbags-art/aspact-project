// components/ads/AdLibrary.tsx
'use client';

import { useState } from 'react';
import { Ad } from '@/types';

interface AdLibraryProps {
  ads: Ad[];
}

export default function AdLibrary({ ads }: AdLibraryProps) {
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);

  return (
    <div className="bg-white rounded-sm shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Ad Library</h2>
        <p className="text-gray-600 mt-1">
          Browse political ads from all tracked platforms
        </p>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Super PAC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impressions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ads.map((ad) => (
              <tr 
                key={ad.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedAd(ad)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {ad.thumbnail && (
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={ad.thumbnail}
                        alt={ad.title}
                      />
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {ad.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {ad.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {ad.platform.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ad.superPAC.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${ad.spend.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ad.impressions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(ad.startDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ad Detail Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{selectedAd.title}</h3>
                <button
                  onClick={() => setSelectedAd(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedAd.thumbnail && (
                  <img
                    src={selectedAd.thumbnail}
                    alt={selectedAd.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Platform</label>
                    <p className="text-sm">{selectedAd.platform.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Super PAC</label>
                    <p className="text-sm">{selectedAd.superPAC.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Spend</label>
                    <p className="text-sm">${selectedAd.spend.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Impressions</label>
                    <p className="text-sm">{selectedAd.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CTR</label>
                    <p className="text-sm">
                      {((selectedAd.clicks / selectedAd.impressions) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ad Type</label>
                    <p className="text-sm">{selectedAd.adType}</p>
                  </div>
                </div>

                {selectedAd.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-sm mt-1">{selectedAd.description}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <a
                    href={selectedAd.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700"
                  >
                    View Ad
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}