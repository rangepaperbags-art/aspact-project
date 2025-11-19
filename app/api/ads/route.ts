// app/api/ads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mockAds } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const superPAC = searchParams.get('superPAC');

    let filteredAds = mockAds;

    if (platform) {
      filteredAds = filteredAds.filter(ad => 
        ad.platform.name.toLowerCase().includes(platform.toLowerCase())
      );
    }

    if (superPAC) {
      filteredAds = filteredAds.filter(ad => 
        ad.superPAC.name.toLowerCase().includes(superPAC.toLowerCase())
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(filteredAds);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}