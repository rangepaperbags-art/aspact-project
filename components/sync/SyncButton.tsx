// components/sync/SyncButton.tsx
'use client';

import { useState } from 'react';
import { apiService } from '@/lib/api-clients';

interface SyncButtonProps {
  onSync: (platform?: string) => Promise<void>;
  syncing: boolean;
}

export default function SyncButton({ onSync, syncing }: SyncButtonProps) {
  const [showPlatforms, setShowPlatforms] = useState(false);
  const platforms = apiService.getRegisteredPlatforms();

  const handleSyncAll = () => {
    onSync();
    setShowPlatforms(false);
  };

  const handleSyncPlatform = (platform: string) => {
    onSync(platform);
    setShowPlatforms(false);
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <button
          onClick={handleSyncAll}
          disabled={syncing}
          className={`
            flex items-center justify-center space-x-2 px-4 py-2 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white
            ${syncing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }
            transition-colors duration-200
          `}
        >
          {syncing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="hidden sm:inline">Syncing...</span>
              <span className="sm:hidden">Sync...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Sync All</span>
              <span className="sm:hidden">Sync</span>
            </>
          )}
        </button>

        {platforms.length > 0 && (
          <button
            onClick={() => setShowPlatforms(!showPlatforms)}
            disabled={syncing}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Platform Dropdown */}
      {showPlatforms && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-2 py-1">Sync Individual Platform</div>
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => handleSyncPlatform(platform)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-between"
              >
                <span>{platform}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {showPlatforms && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPlatforms(false)}
        />
      )}
    </div>
  );
}