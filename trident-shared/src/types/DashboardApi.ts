export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'USDC';

export type AnalyticsOverview = {
    totalViews: number;
    uniqueViewers: number;
    watchTimeMinutes: number;
    conversionRate: number;
    ctr: number;
    rpm: number;
    revenue: number;
};

export type RetentionPoint = {
    minute: number;
    retention: number;
};

export type TrafficSourceStat = {
    source: 'direct' | 'search' | 'social' | 'referral' | 'partner';
    visitors: number;
    ctr: number;
    revenue: number;
};

export type GeographyStat = {
    countryCode: string;
    country: string;
    viewers: number;
    revenue: number;
};

export type HeatmapCell = {
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    hour: number;
    score: number;
};

export type EarningsPoint = {
    label: string;
    earnings: number;
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
    retentionCurve: RetentionPoint[];
    trafficSources: TrafficSourceStat[];
    viewerGeography: GeographyStat[];
    streamPerformanceHeatmap: HeatmapCell[];
    earningsOverTime: EarningsPoint[];
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
    overlays: {
        overlayToken: string;
        channel: string;
        themePresets: Array<{
            key: 'neon' | 'midnight' | 'sunset';
            name: string;
            accent: string;
            background: string;
        }>;
        browserSourceUrls: {
            alertBox: string;
            chatOverlay: string;
            eventTicker: string;
            streamGoal: string;
        };
        widgets: Array<{
            id: string;
            type: 'alert_box' | 'chat_overlay' | 'event_ticker' | 'stream_goal';
            title: string;
            enabled: boolean;
            sampleText: string;
        }>;
        goals: Array<{
            id: string;
            name: string;
            current: number;
            target: number;
        }>;
        recentEvents: Array<{
            id: string;
            type: 'follow' | 'donation' | 'sub';
            viewer: string;
            amount?: number;
            at: string;
        }>;
    };
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
        trigger: {
            type: 'stream_duration_hours' | 'affiliate_sale' | 'default';
            operator: 'gte' | 'eq';
            value: number;
            description: string;
        };
        allocations: Array<{
            wallet: string;
            percentage: number;
            party: string;
        }>;
        updatedAt: string;
    }>;
    ruleHistory: Array<{
        id: string;
        ruleId: string;
        action: 'created' | 'updated' | 'disabled';
        at: string;
        summary: string;
    }>;
    simulation: {
        sampleRevenue: number;
        appliedRuleId: string;
        result: Array<{
            party: string;
            amount: number;
            percentage: number;
        }>;
    };
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
