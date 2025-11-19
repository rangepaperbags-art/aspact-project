// app/api/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api-clients';

export async function POST(request: NextRequest) {
  try {
    const { platform, startDate, endDate } = await request.json();

    const options = {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    let result;
    
    if (platform) {
      // Sync specific platform
      const ads = await apiService.syncPlatform(platform, options);
      result = {
        success: true,
        platform,
        adsCount: ads.length,
        ads: ads.slice(0, 10), // Return first 10 ads for preview
        message: `Successfully synced ${ads.length} ads from ${platform}`
      };
    } else {
      // Sync all platforms
      const ads = await apiService.syncAllData(options);
      result = {
        success: true,
        adsCount: ads.length,
        platforms: apiService.getRegisteredPlatforms(),
        ads: ads.slice(0, 10), // Return first 10 ads for preview
        message: `Successfully synced ${ads.length} ads from all platforms`
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error syncing data:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
        message: 'Failed to sync data from platforms'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check registered platforms
export async function GET() {
  const platforms = apiService.getRegisteredPlatforms();
  
  return NextResponse.json({
    platforms,
    totalPlatforms: platforms.length,
    status: 'ready'
  });
}