// app/api/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api-clients';
import { mockAds, mockAnalytics } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json();

    // Simulate API sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (platform) {
      // Sync specific platform
      const ads = await apiService.syncPlatform(platform);
      return NextResponse.json({ 
        success: true, 
        platform,
        adsCount: ads.length,
        message: `Successfully synced data from ${platform}`
      });
    } else {
      // Sync all platforms
      const ads = await apiService.syncAllData();
      return NextResponse.json({ 
        success: true, 
        adsCount: ads.length,
        message: 'Successfully synced data from all platforms'
      });
    }
  } catch (error) {
    console.error('Error syncing data:', error);
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    );
  }
}