// components/filters/PlatformFilters.tsx
'use client';

import { useState } from 'react';

interface PlatformFiltersProps {
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
}

const AVAILABLE_PLATFORMS = [
  'X (Twitter)',
  'Facebook',
  'YouTube',
  'FEC',
  'OpenSecrets',
  'AdImpact',
  'TV Ad Archive',
  'ACLU Political Ad Watch'
];

export default function PlatformFilters({ 
  selectedPlatforms, 
  onPlatformsChange 
}: PlatformFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onPlatformsChange([...selectedPlatforms, platform]);
    }
  };

  const clearAll = () => {
    onPlatformsChange([]);
  };

  const selectAll = () => {
    onPlatformsChange([...AVAILABLE_PLATFORMS]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span>Filter Platforms</span>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {selectedPlatforms.length}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-900">Platforms</h3>
              <div className="space-x-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  All
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Platform List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {AVAILABLE_PLATFORMS.map((platform) => (
                <label
                  key={platform}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => togglePlatform(platform)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{platform}</span>
                </label>
              ))}
            </div>

            {/* Selected Count */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                {selectedPlatforms.length} of {AVAILABLE_PLATFORMS.length} platforms selected
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}