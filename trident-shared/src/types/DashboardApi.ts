export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'USDC';

export type AnalyticsOverview = {
    totalViews: number;
    uniqueViewers: number;
    watchTimeMinutes: number;
    conversionRate: number;
    revenue: number;
};

export type AnalyticsResponse = {
    generatedAt: string;
    range: '24h' | '7d' | '30d';
    overview: AnalyticsOverview;
    topContent: Array<{
        streamId: string;
        title: string;
        views: number;
        revenue: number;
    }>;
};

export type StreamsResponse = {
    streams: Array<{
        id: string;
        title: string;
        status: 'scheduled' | 'live' | 'ended';
        scheduledAt?: string;
        startedAt?: string;
        viewersPeak?: number;
    }>;
};

export type EarningsResponse = {
    currency: CurrencyCode;
    availableBalance: number;
    pendingBalance: number;
    lifetimeEarnings: number;
    payouts: Array<{
        payoutId: string;
        createdAt: string;
        amount: number;
        status: 'pending' | 'sent' | 'failed';
    }>;
};

export type AutoSplitResponse = {
    rules: Array<{
        id: string;
        name: string;
        isEnabled: boolean;
        allocations: Array<{
            wallet: string;
            percentage: number;
        }>;
    }>;
};

export type ContentResponse = {
    assets: Array<{
        id: string;
        fileName: string;
        mediaType: 'image' | 'video' | 'audio' | 'document';
        createdAt: string;
        sizeBytes: number;
        url: string;
    }>;
};

export type AffiliateResponse = {
    links: Array<{
        id: string;
        productId: string;
        productName: string;
        shortUrl: string;
        clicks: number;
        conversions: number;
        earnings: number;
    }>;
};

export type IntegrationsResponse = {
    providers: Array<{
        key: 'obs' | 'twitch' | 'youtube' | 'discord' | 'webhook';
        isConnected: boolean;
        updatedAt?: string;
    }>;
};

export type SettingsResponse = {
    profile: {
        displayName: string;
        email: string;
        timezone: string;
    };
    security: {
        twoFactorEnabled: boolean;
        apiKeysEnabled: boolean;
    };
};
