// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      totalSpendResult,
      totalImpressionsResult,
      platformDistribution,
      spendingTrends,
      performanceMetrics
    ] = await Promise.all([
      // Total spend
      prisma.ad.aggregate({
        _sum: { spend: true },
      }),

      // Total impressions
      prisma.ad.aggregate({
        _sum: { impressions: true },
      }),

      // Platform distribution
      prisma.ad.groupBy({
        by: ['platformId'],
        _sum: { spend: true, impressions: true },
        _count: { id: true },
      }),

      // Spending trends (last 30 days)
      prisma.spendingAnalytics.findMany({
        where: {
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        include: {
          platform: true,
          superPAC: true,
        },
        orderBy: {
          date: 'asc',
        },
      }),

      // Performance metrics
      prisma.ad.groupBy({
        by: ['platformId'],
        _avg: { spend: true },
        _sum: { impressions: true, clicks: true, spend: true },
      }),
    ]);

    const platforms = await prisma.platform.findMany();
    const platformMap = new Map(platforms.map(p => [p.id, p]));

    const distribution = platformDistribution.map(item => ({
      platform: platformMap.get(item.platformId)?.name || 'Unknown',
      spend: item._sum.spend || 0,
      percentage: 0, // Calculate after
      adCount: item._count.id,
    }));

    // Calculate percentages
    const totalSpend = totalSpendResult._sum.spend || 1;
    distribution.forEach(item => {
      item.percentage = (item.spend / totalSpend) * 100;
    });

    const metrics = performanceMetrics.map(item => ({
      platform: platformMap.get(item.platformId)?.name || 'Unknown',
      ctr: ((item._sum.clicks || 0) / (item._sum.impressions || 1)) * 100,
      cpm: ((item._sum.spend || 0) / (item._sum.impressions || 1)) * 1000,
      averageSpend: item._avg.spend || 0,
    }));

    const analyticsData = {
      totalSpend: totalSpendResult._sum.spend || 0,
      totalImpressions: totalImpressionsResult._sum.impressions || 0,
      platformDistribution: distribution,
      spendingTrends: spendingTrends.map(trend => ({
        date: trend.date.toISOString().split('T')[0],
        spend: trend.totalSpend,
        platform: trend.platform.name,
        superPAC: trend.superPAC.name,
      })),
      performanceMetrics: metrics,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}