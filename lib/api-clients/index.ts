// lib/api-clients/index.ts
import { Ad, AnalyticsData, PlatformType, AdType, PoliticalLeaning } from '@/types';

export interface APIConfig {
  baseURL: string;
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  rateLimit?: number;
  timeout?: number;
}

export interface FetchOptions {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export abstract class BaseAPIClient {
  protected config: APIConfig;
  protected platformName: string;

  constructor(platformName: string, config: APIConfig) {
    this.platformName = platformName;
    this.config = {
      timeout: 30000,
      rateLimit: 1000,
      ...config
    };
  }

  protected async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseURL}${endpoint}`;
    const headersObject: Record<string, string> = {};
    if (typeof options.headers === 'object' && options.headers && !Array.isArray(options.headers)) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headersObject[key] = value;
        });
      } else {
        Object.assign(headersObject, options.headers);
      }
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headersObject,
    };

    // Add authentication headers
    if (this.config.apiKey) {
      headers['X-API-Key'] = this.config.apiKey;
    }
    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.config.timeout!),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  abstract fetchAds(options?: FetchOptions): Promise<Ad[]>;
  abstract fetchSpendingData(options?: FetchOptions): Promise<any>;
}

// Twitter/X API Client
export class TwitterAPIClient extends BaseAPIClient {
  constructor(config: APIConfig) {
    super('X (Twitter)', config);
  }

  async fetchAds(options: FetchOptions = {}): Promise<Ad[]> {
    // TODO: Implement Twitter Ads API integration
    // Example endpoint: /2/ads/accounts/{account_id}/line_items
    console.log('Fetching Twitter ads...', options);
    
    // Mock implementation - replace with actual API calls
    return await this.makeRequest('/ads/line_items', {
      method: 'GET',
    }).then(data => this.transformAds(data));
  }

  async fetchSpendingData(options: FetchOptions = {}): Promise<any> {
    // TODO: Implement Twitter spending analytics
    return await this.makeRequest('/ads/analytics', {
      method: 'GET',
    });
  }

  private transformAds(apiData: any): Ad[] {
    // Transform Twitter API response to our Ad format
    return apiData.data?.map((item: any) => ({
      id: `twitter_${item.id}`,
      title: item.name || 'Twitter Ad',
      description: item.description,
      url: item.target_url,
      thumbnail: item.media_url,
      spend: item.total_spend || 0,
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      targetAudience: item.targeting?.audience_type,
      adType: this.mapAdType(item.creative_type),
      startDate: new Date(item.start_time),
      endDate: item.end_time ? new Date(item.end_time) : undefined,
      metadata: {
        campaign_id: item.campaign_id,
        line_item_id: item.id,
        placement: item.placement,
        ...item
      }
    })) || [];
  }

  private mapAdType(twitterType: string): AdType {
    const typeMap: Record<string, AdType> = {
      'VIDEO': 'VIDEO',
      'IMAGE': 'IMAGE',
      'CAROUSEL': 'CAROUSEL',
      'TEXT': 'TEXT'
    };
    return typeMap[twitterType] || 'TEXT';
  }
}

// Facebook/Meta API Client
export class FacebookAPIClient extends BaseAPIClient {
  constructor(config: APIConfig) {
    super('Facebook', config);
  }

  async fetchAds(options: FetchOptions = {}): Promise<Ad[]> {
    // TODO: Implement Facebook Ads API integration
    // Example endpoint: /v18.0/act_{ad_account_id}/ads
    console.log('Fetching Facebook ads...', options);
    
    return await this.makeRequest('/ads', {
      method: 'GET',
    }).then(data => this.transformAds(data));
  }

  async fetchSpendingData(options: FetchOptions = {}): Promise<any> {
    return await this.makeRequest('/insights', {
      method: 'GET',
    });
  }

  private transformAds(apiData: any): Ad[] {
    return apiData.data?.map((item: any) => ({
      id: `facebook_${item.id}`,
      title: item.name || 'Facebook Ad',
      description: item.body,
      url: item.permalink_url,
      thumbnail: item.thumbnail_url,
      spend: item.spend || 0,
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      targetAudience: item.targeting?.audience_type,
      adType: this.mapAdType(item.creative_type),
      startDate: new Date(item.start_time),
      endDate: item.end_time ? new Date(item.end_time) : undefined,
      metadata: {
        ad_set_id: item.adset_id,
        campaign_id: item.campaign_id,
        ...item
      }
    })) || [];
  }

  private mapAdType(facebookType: string): AdType {
    const typeMap: Record<string, AdType> = {
      'VIDEO': 'VIDEO',
      'IMAGE': 'IMAGE',
      'CAROUSEL': 'CAROUSEL',
      'SLIDESHOW': 'VIDEO'
    };
    return typeMap[facebookType] || 'TEXT';
  }
}

// YouTube API Client
export class YouTubeAPIClient extends BaseAPIClient {
  constructor(config: APIConfig) {
    super('YouTube', config);
  }

  async fetchAds(options: FetchOptions = {}): Promise<Ad[]> {
    // TODO: Implement YouTube Ads API integration
    console.log('Fetching YouTube ads...', options);
    
    return await this.makeRequest('/ads', {
      method: 'GET',
    }).then(data => this.transformAds(data));
  }

  async fetchSpendingData(options: FetchOptions = {}): Promise<any> {
    return await this.makeRequest('/analytics', {
      method: 'GET',
    });
  }

  private transformAds(apiData: any): Ad[] {
    return apiData.items?.map((item: any) => ({
      id: `youtube_${item.id}`,
      title: item.snippet?.title || 'YouTube Ad',
      description: item.snippet?.description,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      thumbnail: item.snippet?.thumbnails?.high?.url,
      spend: item.analytics?.spend || 0,
      impressions: item.analytics?.impressions || 0,
      clicks: item.analytics?.clicks || 0,
      adType: 'VIDEO',
      startDate: new Date(item.snippet?.publishedAt),
      metadata: {
        channel_id: item.snippet?.channelId,
        ...item
      }
    })) || [];
  }
}

// Federal Election Commission (FEC) API Client
export class FECAPIClient extends BaseAPIClient {
  constructor(config: APIConfig) {
    super('Federal Election Commission', config);
  }

  async fetchAds(options: FetchOptions = {}): Promise<Ad[]> {
    // FEC doesn't have "ads" but we can fetch independent expenditures
    console.log('Fetching FEC independent expenditures...', options);
    
    const queryParams = new URLSearchParams();
    if (options.startDate) {
      queryParams.append('min_date', options.startDate.toISOString().split('T')[0]);
    }
    if (options.endDate) {
      queryParams.append('max_date', options.endDate.toISOString().split('T')[0]);
    }
    queryParams.append('is_notice', 'true');
    queryParams.append('per_page', '100');

    return await this.makeRequest(`/schedules/schedule_e?${queryParams}`, {
      method: 'GET',
    }).then(data => this.transformExpenditures(data));
  }

  async fetchSpendingData(options: FetchOptions = {}): Promise<any> {
    return await this.makeRequest('/schedules/schedule_e/totals', {
      method: 'GET',
    });
  }

  private transformExpenditures(apiData: any): Ad[] {
    return apiData.results?.map((item: any) => ({
      id: `fec_${item.sub_id}`,
      title: item.payee_name || 'FEC Independent Expenditure',
      description: `Expenditure for ${item.candidate_name} - ${item.expenditure_description}`,
      url: `https://www.fec.gov/data/independent-expenditures/?sub_id=${item.sub_id}`,
      spend: Math.abs(item.expenditure_amount), // Amounts are negative in FEC data
      impressions: 0, // FEC doesn't track impressions
      clicks: 0, // FEC doesn't track clicks
      adType: 'TEXT',
      politicalLeaning: this.inferLeaning(item),
      startDate: new Date(item.expenditure_date),
      fecId: item.sub_id,
      committeeId: item.committee_id,
      metadata: {
        candidate_name: item.candidate_name,
        payee_name: item.payee_name,
        support_oppose: item.support_oppose_indicator,
        election_type: item.election_type,
        office: item.office,
        ...item
      }
    })) || [];
  }

  private inferLeaning(item: any): PoliticalLeaning {
    // Simple inference based on committee and candidate
    // This would need more sophisticated logic in production
    if (item.support_oppose_indicator === 'S') {
      return 'PROGRESSIVE';
    } else if (item.support_oppose_indicator === 'O') {
      return 'CONSERVATIVE';
    }
    return 'NON_PARTISAN';
  }
}

// OpenSecrets API Client
export class OpenSecretsAPIClient extends BaseAPIClient {
  constructor(config: APIConfig) {
    super('OpenSecrets', config);
  }

  async fetchAds(options: FetchOptions = {}): Promise<Ad[]> {
    // OpenSecrets provides campaign finance data
    console.log('Fetching OpenSecrets data...', options);
    
    return await this.makeRequest('/method=independentExpend', {
      method: 'GET',
    }).then(data => this.transformData(data));
  }

  async fetchSpendingData(options: FetchOptions = {}): Promise<any> {
    return await this.makeRequest('/method=candSummary', {
      method: 'GET',
    });
  }

  private transformData(apiData: any): Ad[] {
    return apiData.response?.expenditures?.map((item: any) => ({
      id: `opensecrets_${item.id}`,
      title: `${item.spender} - ${item.purpose}`,
      description: item.purpose,
      url: item.url,
      spend: parseFloat(item.amount) || 0,
      impressions: 0,
      clicks: 0,
      adType: 'TEXT',
      startDate: new Date(item.date),
      metadata: {
        spender: item.spender,
        candidate: item.candidate,
        ...item
      }
    })) || [];
  }
}

// AdImpact API Client
export class AdImpactAPIClient extends BaseAPIClient {
  constructor(config: APIConfig) {
    super('AdImpact', config);
  }

  async fetchAds(options: FetchOptions = {}): Promise<Ad[]> {
    console.log('Fetching AdImpact data...', options);
    
    return await this.makeRequest('/ads', {
      method: 'GET',
    }).then(data => this.transformAds(data));
  }

  async fetchSpendingData(options: FetchOptions = {}): Promise<any> {
    return await this.makeRequest('/spending', {
      method: 'GET',
    });
  }

  private transformAds(apiData: any): Ad[] {
    return apiData.ads?.map((item: any) => ({
      id: `adimpact_${item.ad_id}`,
      title: item.ad_name,
      description: item.ad_description,
      url: item.ad_url,
      thumbnail: item.thumbnail_url,
      spend: item.estimated_spend || 0,
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      targetAudience: item.target_demographics,
      adType: this.mapAdType(item.ad_format),
      startDate: new Date(item.start_date),
      endDate: item.end_date ? new Date(item.end_date) : undefined,
      metadata: {
        market: item.market,
        station: item.station,
        ...item
      }
    })) || [];
  }

  private mapAdType(format: string): AdType {
    const typeMap: Record<string, AdType> = {
      'VIDEO': 'VIDEO',
      'DISPLAY': 'IMAGE',
      'TEXT': 'TEXT'
    };
    return typeMap[format] || 'TEXT';
  }
}

// TV Ad Archive API Client
export class TVAdArchiveAPIClient extends BaseAPIClient {
  constructor(config: APIConfig) {
    super('TV Ad Archive', config);
  }

  async fetchAds(options: FetchOptions = {}): Promise<Ad[]> {
    console.log('Fetching TV Ad Archive data...', options);
    
    return await this.makeRequest('/ads', {
      method: 'GET',
    }).then(data => this.transformAds(data));
  }

  async fetchSpendingData(options: FetchOptions = {}): Promise<any> {
    return await this.makeRequest('/spending', {
      method: 'GET',
    });
  }

  private transformAds(apiData: any): Ad[] {
    return apiData.ads?.map((item: any) => ({
      id: `tvad_${item.id}`,
      title: item.program || 'TV Advertisement',
      description: item.sponsor,
      url: item.archive_url,
      thumbnail: item.thumbnail_url,
      spend: item.estimated_cost || 0,
      impressions: item.air_count || 0,
      clicks: 0, // TV ads don't have clicks
      adType: 'VIDEO',
      startDate: new Date(item.air_date),
      metadata: {
        sponsor: item.sponsor,
        program: item.program,
        market: item.market,
        ...item
      }
    })) || [];
  }
}

// ACLU Political Ad Watch API Client
export class ACLUAdWatchAPIClient extends BaseAPIClient {
  constructor(config: APIConfig) {
    super('ACLU Political Ad Watch', config);
  }

  async fetchAds(options: FetchOptions = {}): Promise<Ad[]> {
    console.log('Fetching ACLU Political Ad Watch data...', options);
    
    return await this.makeRequest('/ads', {
      method: 'GET',
    }).then(data => this.transformAds(data));
  }

  async fetchSpendingData(options: FetchOptions = {}): Promise<any> {
    return await this.makeRequest('/analytics', {
      method: 'GET',
    });
  }

  private transformAds(apiData: any): Ad[] {
    return apiData.ads?.map((item: any) => ({
      id: `aclu_${item.id}`,
      title: item.title,
      description: item.description,
      url: item.ad_url,
      thumbnail: item.thumbnail_url,
      spend: item.spend || 0,
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      adType: this.mapAdType(item.ad_type),
      politicalLeaning: item.leaning as PoliticalLeaning,
      startDate: new Date(item.start_date),
      endDate: item.end_date ? new Date(item.end_date) : undefined,
      metadata: {
        sponsor: item.sponsor,
        issues: item.issues,
        ...item
      }
    })) || [];
  }

  private mapAdType(adType: string): AdType {
    const typeMap: Record<string, AdType> = {
      'video': 'VIDEO',
      'image': 'IMAGE',
      'text': 'TEXT'
    };
    return typeMap[adType] || 'TEXT';
  }
}

// Main API Service
export class APIService {
  private clients: Map<string, BaseAPIClient> = new Map();

  registerClient(platform: string, client: BaseAPIClient) {
    this.clients.set(platform, client);
    console.log(`Registered API client for: ${platform}`);
  }

  getClient(platform: string): BaseAPIClient | undefined {
    return this.clients.get(platform);
  }

  async syncAllData(options: FetchOptions = {}): Promise<Ad[]> {
    const allAds: Ad[] = [];
    const results: { platform: string; ads: Ad[]; error?: string }[] = [];
    
    for (const [platform, client] of this.clients) {
      try {
        console.log(`Syncing data from ${platform}...`);
        const ads = await client.fetchAds(options);
        allAds.push(...ads);
        results.push({ platform, ads });
        console.log(`✅ ${platform}: ${ads.length} ads fetched`);
      } catch (error) {
        console.error(`❌ Error syncing from ${platform}:`, error);
        results.push({ 
          platform, 
          ads: [], 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    // Log summary
    console.log('Sync completed:', {
      totalAds: allAds.length,
      platforms: results.map(r => ({
        platform: r.platform,
        adsCount: r.ads.length,
        status: r.error ? 'failed' : 'success'
      }))
    });

    return allAds;
  }

  async syncPlatform(platform: string, options: FetchOptions = {}): Promise<Ad[]> {
    const client = this.clients.get(platform);
    if (!client) {
      throw new Error(`No client registered for platform: ${platform}`);
    }
    
    console.log(`Syncing data from ${platform}...`);
    const ads = await client.fetchAds(options);
    console.log(`✅ ${platform}: ${ads.length} ads fetched`);
    
    return ads;
  }

  getRegisteredPlatforms(): string[] {
    return Array.from(this.clients.keys());
  }
}

// Export singleton instance
export const apiService = new APIService();

// Configuration helper
export function configureAPIClients() {
  // Twitter/X Configuration
  if (process.env.TWITTER_API_KEY && process.env.TWITTER_API_SECRET) {
    apiService.registerClient('X (Twitter)', new TwitterAPIClient({
      baseURL: 'https://api.twitter.com/2',
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
    }));
  }

  // Facebook/Meta Configuration
  if (process.env.FACEBOOK_ACCESS_TOKEN) {
    apiService.registerClient('Facebook', new FacebookAPIClient({
      baseURL: 'https://graph.facebook.com/v18.0',
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
    }));
  }

  // YouTube Configuration
  if (process.env.YOUTUBE_API_KEY) {
    apiService.registerClient('YouTube', new YouTubeAPIClient({
      baseURL: 'https://www.googleapis.com/youtube/v3',
      apiKey: process.env.YOUTUBE_API_KEY,
    }));
  }

  // FEC Configuration (public API, no key required but rate limited)
  apiService.registerClient('Federal Election Commission', new FECAPIClient({
    baseURL: 'https://api.open.fec.gov/v1',
    apiKey: process.env.FEC_API_KEY, // Optional for higher rate limits
  }));

  // OpenSecrets Configuration
  if (process.env.OPENSECRETS_API_KEY) {
    apiService.registerClient('OpenSecrets', new OpenSecretsAPIClient({
      baseURL: 'https://www.opensecrets.org/api',
      apiKey: process.env.OPENSECRETS_API_KEY,
    }));
  }

  // AdImpact Configuration
  if (process.env.ADIMPACT_API_KEY) {
    apiService.registerClient('AdImpact', new AdImpactAPIClient({
      baseURL: 'https://api.adimpact.com/v1',
      apiKey: process.env.ADIMPACT_API_KEY,
    }));
  }

  // TV Ad Archive Configuration
  apiService.registerClient('TV Ad Archive', new TVAdArchiveAPIClient({
    baseURL: 'https://archive.org/services/tv-ads',
    // No API key required for basic access
  }));

  // ACLU Political Ad Watch Configuration
  if (process.env.ACLU_API_KEY) {
    apiService.registerClient('ACLU Political Ad Watch', new ACLUAdWatchAPIClient({
      baseURL: 'https://api.aclu.org/political-ads/v1',
      apiKey: process.env.ACLU_API_KEY,
    }));
  }

  console.log(`API Service configured with ${apiService.getRegisteredPlatforms().length} platforms`);
  console.log('Registered platforms:', apiService.getRegisteredPlatforms());
}

// Initialize on import
configureAPIClients();








// // lib/api-clients/index.ts
// import { Ad, AnalyticsData } from '@/types';

// export interface APIConfig {
//   baseURL: string;
//   apiKey?: string;
//   rateLimit?: number;
// }

// export abstract class BaseAPIClient {
//   protected config: APIConfig;

//   constructor(config: APIConfig) {
//     this.config = config;
//   }

//   abstract fetchAds(startDate?: Date, endDate?: Date): Promise<Ad[]>;
//   abstract fetchSpendingData(): Promise<any>;
// }

// // Twitter/X API Client
// export class TwitterAPIClient extends BaseAPIClient {
//   async fetchAds(startDate?: Date, endDate?: Date): Promise<Ad[]> {
//     // TODO: Implement Twitter Ads API integration
//     console.log('Fetching Twitter ads...');
//     return [];
//   }

//   async fetchSpendingData(): Promise<any> {
//     // TODO: Implement Twitter spending data
//     return {};
//   }
// }

// // Facebook API Client
// export class FacebookAPIClient extends BaseAPIClient {
//   async fetchAds(startDate?: Date, endDate?: Date): Promise<Ad[]> {
//     // TODO: Implement Facebook Ads API integration
//     console.log('Fetching Facebook ads...');
//     return [];
//   }

//   async fetchSpendingData(): Promise<any> {
//     // TODO: Implement Facebook spending data
//     return {};
//   }
// }

// // YouTube API Client
// export class YouTubeAPIClient extends BaseAPIClient {
//   async fetchAds(startDate?: Date, endDate?: Date): Promise<Ad[]> {
//     // TODO: Implement YouTube Ads API integration
//     console.log('Fetching YouTube ads...');
//     return [];
//   }

//   async fetchSpendingData(): Promise<any> {
//     // TODO: Implement YouTube spending data
//     return {};
//   }
// }

// // FEC API Client
// export class FECAPIClient extends BaseAPIClient {
//   async fetchAds(startDate?: Date, endDate?: Date): Promise<Ad[]> {
//     // TODO: Implement FEC API integration
//     console.log('Fetching FEC data...');
//     return [];
//   }

//   async fetchSpendingData(): Promise<any> {
//     // TODO: Implement FEC spending data
//     return {};
//   }
// }

// // OpenSecrets API Client
// export class OpenSecretsAPIClient extends BaseAPIClient {
//   async fetchAds(startDate?: Date, endDate?: Date): Promise<Ad[]> {
//     // TODO: Implement OpenSecrets API integration
//     console.log('Fetching OpenSecrets data...');
//     return [];
//   }

//   async fetchSpendingData(): Promise<any> {
//     // TODO: Implement OpenSecrets spending data
//     return {};
//   }
// }

// // Main API Service
// export class APIService {
//   private clients: Map<string, BaseAPIClient> = new Map();

//   registerClient(platform: string, client: BaseAPIClient) {
//     this.clients.set(platform, client);
//   }

//   async syncAllData(): Promise<Ad[]> {
//     const allAds: Ad[] = [];
    
//     for (const [platform, client] of this.clients) {
//       try {
//         console.log(`Syncing data from ${platform}...`);
//         const ads = await client.fetchAds();
//         allAds.push(...ads);
//       } catch (error) {
//         console.error(`Error syncing from ${platform}:`, error);
//       }
//     }

//     return allAds;
//   }

//   async syncPlatform(platform: string): Promise<Ad[]> {
//     const client = this.clients.get(platform);
//     if (!client) {
//       throw new Error(`No client registered for platform: ${platform}`);
//     }
//     return await client.fetchAds();
//   }
// }

// // Export singleton instance
// export const apiService = new APIService();

// // Initialize with mock clients for now
// apiService.registerClient('twitter', new TwitterAPIClient({
//   baseURL: 'https://api.twitter.com/2',
//   apiKey: process.env.TWITTER_API_KEY
// }));

// apiService.registerClient('facebook', new FacebookAPIClient({
//   baseURL: 'https://graph.facebook.com/v18.0',
//   apiKey: process.env.FACEBOOK_API_KEY
// }));

// // ... register other clients