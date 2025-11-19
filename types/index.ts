// types/index.ts
export interface Ad {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  superPAC: SuperPAC;
  platform: Platform;
  spend: number;
  impressions: number;
  clicks: number;
  targetAudience?: string;
  adType: AdType;
  politicalLeaning?: PoliticalLeaning;
  startDate: Date;
  endDate?: Date;
  metadata?: Record<string, any>;
  fecId?: string;
  committeeId?: string;
}

export interface SuperPAC {
  id: string;
  name: string;
  legalName: string;
  fundingOrganization: string;
  fecCommitteeId: string;
  description?: string;
  website?: string;
  contactInfo?: string;
}

export interface Platform {
  id: string;
  name: string;
  type: PlatformType;
  apiEndpoint?: string;
  isGovernment?: boolean;
}

export interface AnalyticsData {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  platformDistribution: PlatformDistribution[];
  spendingTrends: SpendingTrend[];
  performanceMetrics: PerformanceMetric[];
}

export interface PlatformDistribution {
  platform: string;
  spend: number;
  percentage: number;
  adCount: number;
}

export interface SpendingTrend {
  date: string;
  spend: number;
  platform: string;
  superPAC: string;
}

export interface PerformanceMetric {
  platform: string;
  ctr: number;
  cpm: number;
  averageSpend: number;
}

export interface FECRecord {
  id: string;
  committee_id: string;
  committee_name: string;
  report_type: string;
  form_type: string;
  transaction_type: string;
  amount: number;
  date: string;
  contributor_name?: string;
  recipient_name?: string;
  purpose?: string;
  fec_url: string;
}

export interface SpendingBreakdown {
  superPAC: SuperPAC;
  totalSpend: number;
  platformSpend: PlatformSpend[];
  fecFilings: FECRecord[];
  spendingByDate: DateSpend[];
  topAds: Ad[];
}

export interface PlatformSpend {
  platform: Platform;
  spend: number;
  percentage: number;
  adCount: number;
  averageCTR: number;
}

export interface DateSpend {
  date: string;
  spend: number;
  platform: string;
}

// Enums
export type PlatformType = 'SOCIAL_MEDIA' | 'TV' | 'GOVERNMENT' | 'RESEARCH';
export type AdType = 'VIDEO' | 'IMAGE' | 'TEXT' | 'CAROUSEL';
export type PoliticalLeaning = 'PROGRESSIVE' | 'CONSERVATIVE' | 'MODERATE' | 'NON_PARTISAN';