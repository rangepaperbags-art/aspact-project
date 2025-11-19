// lib/mockData.ts
import { 
  Ad, 
  AnalyticsData, 
  SuperPAC, 
  Platform, 
  FECRecord, 
  SpendingBreakdown,
  PlatformType,
  AdType,
  PoliticalLeaning 
} from '@/types';

// Mock Super PACs
export const mockSuperPacs: SuperPAC[] = [
  {
    id: '1',
    name: 'Leading the Future',
    legalName: 'Leading the Future PAC',
    fundingOrganization: 'OpenAI + Andreessen Horowitz (a16z)',
    fecCommitteeId: 'C00708475',
    description: 'Independent expenditure-only political committee focused on AI innovation and technology advancement',
    website: 'https://leadingthefuture.org',
    contactInfo: 'info@leadingthefuture.org'
  },
  {
    id: '2', 
    name: 'American Technology Excellence',
    legalName: 'American Technology Excellence Project',
    fundingOrganization: 'Meta Platforms Inc.',
    fecCommitteeId: 'C00709123',
    description: 'Super PAC promoting technological excellence and digital infrastructure in America',
    website: 'https://americantechexcellence.org',
    contactInfo: 'contact@americantechexcellence.org'
  },
  {
    id: '3',
    name: 'Economic Transformation America', 
    legalName: 'Mobilising Economic Transformation Across America',
    fundingOrganization: 'Meta Platforms Inc.',
    fecCommitteeId: 'C00709234',
    description: 'Super PAC focused on economic transformation through technology and innovation',
    website: 'https://economictransformation.org',
    contactInfo: 'info@economictransformation.org'
  }
];

// Mock Platforms
export const mockPlatforms: Platform[] = [
  { id: '1', name: 'X (Twitter)', type: 'SOCIAL_MEDIA' as PlatformType },
  { id: '2', name: 'Facebook', type: 'SOCIAL_MEDIA' as PlatformType },
  { id: '3', name: 'YouTube', type: 'SOCIAL_MEDIA' as PlatformType },
  { id: '4', name: 'Federal Election Commission', type: 'GOVERNMENT' as PlatformType, isGovernment: true },
  { id: '5', name: 'OpenSecrets', type: 'RESEARCH' as PlatformType },
  { id: '6', name: 'AdImpact', type: 'RESEARCH' as PlatformType },
  { id: '7', name: 'TV Ad Archive', type: 'TV' as PlatformType },
  { id: '8', name: 'ACLU Political Ad Watch', type: 'RESEARCH' as PlatformType }
];

// Mock FEC Records
export const mockFECRecords: FECRecord[] = [
  {
    id: '1',
    committee_id: 'C00708475',
    committee_name: 'Leading the Future PAC',
    report_type: 'Independent Expenditure',
    form_type: 'FEC Form 3X',
    transaction_type: 'Expenditure',
    amount: 500000,
    date: '2024-01-15',
    purpose: 'Digital advertising - AI innovation campaign',
    fec_url: 'https://www.fec.gov/data/committee/C00708475/'
  },
  {
    id: '2',
    committee_id: 'C00709123', 
    committee_name: 'American Technology Excellence Project',
    report_type: 'Independent Expenditure',
    form_type: 'FEC Form 3X',
    transaction_type: 'Expenditure',
    amount: 750000,
    date: '2024-01-20',
    purpose: 'Media buys - Technology excellence initiative',
    fec_url: 'https://www.fec.gov/data/committee/C00709123/'
  },
  {
    id: '3',
    committee_id: 'C00709234',
    committee_name: 'Mobilising Economic Transformation Across America', 
    report_type: 'Independent Expenditure',
    form_type: 'FEC Form 3X',
    transaction_type: 'Expenditure',
    amount: 600000,
    date: '2024-01-25',
    purpose: 'Advertising - Economic transformation campaign',
    fec_url: 'https://www.fec.gov/data/committee/C00709234/'
  }
];

// Generate enhanced mock ads
export const mockAds: Ad[] = [
  {
    id: '1',
    title: 'AI Innovation for American Future',
    description: 'Supporting AI research and development for national competitiveness',
    url: 'https://example.com/ai-innovation',
    thumbnail: '/api/placeholder/300/200',
    superPAC: mockSuperPacs[0],
    platform: mockPlatforms[0],
    spend: 150000,
    impressions: 2500000,
    clicks: 125000,
    targetAudience: 'Tech professionals, ages 25-45',
    adType: 'VIDEO' as AdType,
    politicalLeaning: 'PROGRESSIVE' as PoliticalLeaning,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    fecId: 'FEC-2024-LTF-001',
    committeeId: 'C00708475',
    metadata: { engagement: 'high', sentiment: 'positive' }
  },
  {
    id: '2',
    title: 'Building the Next Generation of AI',
    description: 'Investing in AI education and research infrastructure',
    url: 'https://example.com/ai-education',
    thumbnail: '/api/placeholder/300/200',
    superPAC: mockSuperPacs[0],
    platform: mockPlatforms[1],
    spend: 200000,
    impressions: 3500000,
    clicks: 175000,
    targetAudience: 'Educators, students',
    adType: 'CAROUSEL' as AdType,
    politicalLeaning: 'PROGRESSIVE' as PoliticalLeaning,
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-02-20'),
    fecId: 'FEC-2024-LTF-002',
    committeeId: 'C00708475',
    metadata: { engagement: 'medium', sentiment: 'positive' }
  },
  {
    id: '3',
    title: 'Tech Excellence for America',
    description: 'Promoting American leadership in technology and innovation',
    url: 'https://example.com/tech-excellence',
    thumbnail: '/api/placeholder/300/200',
    superPAC: mockSuperPacs[1],
    platform: mockPlatforms[2],
    spend: 300000,
    impressions: 5000000,
    clicks: 200000,
    targetAudience: 'General public',
    adType: 'VIDEO' as AdType,
    politicalLeaning: 'MODERATE' as PoliticalLeaning,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-02-10'),
    fecId: 'FEC-2024-ATEP-001',
    committeeId: 'C00709123',
    metadata: { engagement: 'high', sentiment: 'neutral' }
  },
  {
    id: '4',
    title: 'Digital Transformation Initiative',
    description: 'Modernizing American infrastructure through technology',
    url: 'https://example.com/digital-transformation',
    thumbnail: '/api/placeholder/300/200',
    superPAC: mockSuperPacs[1],
    platform: mockPlatforms[0],
    spend: 120000,
    impressions: 1800000,
    clicks: 90000,
    targetAudience: 'Business leaders, policymakers',
    adType: 'IMAGE' as AdType,
    politicalLeaning: 'MODERATE' as PoliticalLeaning,
    startDate: new Date('2024-01-25'),
    fecId: 'FEC-2024-ATEP-002',
    committeeId: 'C00709123',
    metadata: { engagement: 'medium', sentiment: 'positive' }
  },
  {
    id: '5',
    title: 'Economic Transformation Through Tech',
    description: 'Creating jobs and opportunities with technology',
    url: 'https://example.com/economic-transformation',
    thumbnail: '/api/placeholder/300/200',
    superPAC: mockSuperPacs[2],
    platform: mockPlatforms[1],
    spend: 180000,
    impressions: 2800000,
    clicks: 140000,
    targetAudience: 'Working professionals',
    adType: 'VIDEO' as AdType,
    politicalLeaning: 'PROGRESSIVE' as PoliticalLeaning,
    startDate: new Date('2024-01-18'),
    endDate: new Date('2024-02-18'),
    fecId: 'FEC-2024-META-001',
    committeeId: 'C00709234',
    metadata: { engagement: 'high', sentiment: 'positive' }
  }
];

// Mock Analytics Data
export const mockAnalytics: AnalyticsData = {
  totalSpend: 1350000,
  totalImpressions: 22300000,
  totalClicks: 1115000,
  platformDistribution: [
    { platform: 'X (Twitter)', spend: 270000, percentage: 20, adCount: 2 },
    { platform: 'Facebook', spend: 380000, percentage: 28.1, adCount: 2 },
    { platform: 'YouTube', spend: 300000, percentage: 22.2, adCount: 1 },
    { platform: 'OpenSecrets', spend: 90000, percentage: 6.7, adCount: 1 },
    { platform: 'TV Ad Archive', spend: 250000, percentage: 18.5, adCount: 1 },
    { platform: 'ACLU Political Ad Watch', spend: 80000, percentage: 5.9, adCount: 1 }
  ],
  spendingTrends: [
    { date: '2024-01-10', spend: 300000, platform: 'YouTube', superPAC: 'American Technology Excellence' },
    { date: '2024-01-15', spend: 150000, platform: 'X (Twitter)', superPAC: 'Leading the Future' },
    { date: '2024-01-18', spend: 180000, platform: 'Facebook', superPAC: 'Economic Transformation America' },
    { date: '2024-01-20', spend: 200000, platform: 'Facebook', superPAC: 'Leading the Future' },
    { date: '2024-01-25', spend: 120000, platform: 'X (Twitter)', superPAC: 'American Technology Excellence' },
    { date: '2024-01-30', spend: 90000, platform: 'OpenSecrets', superPAC: 'Economic Transformation America' },
    { date: '2024-02-01', spend: 250000, platform: 'TV Ad Archive', superPAC: 'Leading the Future' },
    { date: '2024-02-05', spend: 80000, platform: 'ACLU Political Ad Watch', superPAC: 'American Technology Excellence' }
  ],
  performanceMetrics: [
    { platform: 'X (Twitter)', ctr: 5.0, cpm: 108, averageSpend: 135000 },
    { platform: 'Facebook', ctr: 5.0, cpm: 108.6, averageSpend: 190000 },
    { platform: 'YouTube', ctr: 4.0, cpm: 60, averageSpend: 300000 },
    { platform: 'OpenSecrets', ctr: 5.0, cpm: 75, averageSpend: 90000 },
    { platform: 'TV Ad Archive', ctr: 4.5, cpm: 62.5, averageSpend: 250000 },
    { platform: 'ACLU Political Ad Watch', ctr: 5.0, cpm: 53.3, averageSpend: 80000 }
  ]
};

// Enhanced Spending Breakdown Data
export const mockSpendingBreakdown: SpendingBreakdown[] = [
  {
    superPAC: mockSuperPacs[0],
    totalSpend: 850000,
    platformSpend: [
      { platform: mockPlatforms[0], spend: 250000, percentage: 29.4, adCount: 3, averageCTR: 5.2 },
      { platform: mockPlatforms[1], spend: 300000, percentage: 35.3, adCount: 4, averageCTR: 4.8 },
      { platform: mockPlatforms[2], spend: 200000, percentage: 23.5, adCount: 2, averageCTR: 4.5 },
      { platform: mockPlatforms[6], spend: 100000, percentage: 11.8, adCount: 1, averageCTR: 4.2 }
    ],
    fecFilings: mockFECRecords.filter(record => record.committee_id === 'C00708475'),
    spendingByDate: [
      { date: '2024-01-15', spend: 150000, platform: 'X (Twitter)' },
      { date: '2024-01-20', spend: 200000, platform: 'Facebook' },
      { date: '2024-01-25', spend: 250000, platform: 'YouTube' },
      { date: '2024-02-01', spend: 100000, platform: 'TV Ad Archive' },
      { date: '2024-02-05', spend: 150000, platform: 'X (Twitter)' }
    ],
    topAds: mockAds.filter(ad => ad.superPAC.id === '1').slice(0, 3)
  },
  {
    superPAC: mockSuperPacs[1],
    totalSpend: 1200000,
    platformSpend: [
      { platform: mockPlatforms[1], spend: 400000, percentage: 33.3, adCount: 5, averageCTR: 4.9 },
      { platform: mockPlatforms[2], spend: 350000, percentage: 29.2, adCount: 3, averageCTR: 4.7 },
      { platform: mockPlatforms[0], spend: 250000, percentage: 20.8, adCount: 3, averageCTR: 5.1 },
      { platform: mockPlatforms[6], spend: 200000, percentage: 16.7, adCount: 2, averageCTR: 4.4 }
    ],
    fecFilings: mockFECRecords.filter(record => record.committee_id === 'C00709123'),
    spendingByDate: [
      { date: '2024-01-10', spend: 300000, platform: 'YouTube' },
      { date: '2024-01-18', spend: 200000, platform: 'Facebook' },
      { date: '2024-01-25', spend: 250000, platform: 'X (Twitter)' },
      { date: '2024-02-02', spend: 250000, platform: 'TV Ad Archive' },
      { date: '2024-02-08', spend: 200000, platform: 'Facebook' }
    ],
    topAds: mockAds.filter(ad => ad.superPAC.id === '2').slice(0, 3)
  },
  {
    superPAC: mockSuperPacs[2],
    totalSpend: 950000,
    platformSpend: [
      { platform: mockPlatforms[1], spend: 350000, percentage: 36.8, adCount: 4, averageCTR: 4.6 },
      { platform: mockPlatforms[0], spend: 250000, percentage: 26.3, adCount: 3, averageCTR: 5.0 },
      { platform: mockPlatforms[2], spend: 200000, percentage: 21.1, adCount: 2, averageCTR: 4.3 },
      { platform: mockPlatforms[4], spend: 150000, percentage: 15.8, adCount: 2, averageCTR: 4.8 }
    ],
    fecFilings: mockFECRecords.filter(record => record.committee_id === 'C00709234'),
    spendingByDate: [
      { date: '2024-01-12', spend: 200000, platform: 'Facebook' },
      { date: '2024-01-20', spend: 150000, platform: 'X (Twitter)' },
      { date: '2024-01-28', spend: 200000, platform: 'YouTube' },
      { date: '2024-02-05', spend: 250000, platform: 'Facebook' },
      { date: '2024-02-12', spend: 150000, platform: 'OpenSecrets' }
    ],
    topAds: mockAds.filter(ad => ad.superPAC.id === '3').slice(0, 3)
  }
];