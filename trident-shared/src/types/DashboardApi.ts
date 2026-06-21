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
        status: 'draft' | 'processing' | 'ready' | 'scheduled';
        durationSeconds?: number;
        tags: string[];
    }>;
    scheduler: {
        timezone: string;
        nextPublishAt: string;
        queuedPosts: number;
        scheduledThisWeek: number;
        publishWindows: Array<{
            id: string;
            label: string;
            day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
            startHourUtc: number;
            durationHours: number;
            platform: 'youtube' | 'twitch' | 'instagram' | 'tiktok';
            goal: 'reach' | 'engagement' | 'conversion';
        }>;
        queue: Array<{
            id: string;
            title: string;
            assetId: string;
            platform: 'youtube' | 'twitch' | 'instagram' | 'tiktok';
            campaign: string;
            status: 'draft' | 'scheduled' | 'published' | 'failed';
            scheduledFor: string;
            estimatedReach: number;
        }>;
        campaignPerformance: Array<{
            campaign: string;
            scheduledPosts: number;
            publishedPosts: number;
            engagementRate: number;
        }>;
    };
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
    catalog: Array<{
        id: string;
        name: string;
        category: string;
        price: number;
        commissionRate: number;
        rating: number;
    }>;
    topProducts: Array<{
        productId: string;
        productName: string;
        conversionRate: number;
        earnings: number;
    }>;
    conversionTrend: Array<{
        label: string;
        conversions: number;
        earnings: number;
    }>;
    generator: {
        baseUrl: string;
        defaultCampaign: string;
        lastGeneratedUrl: string;
    };
};

export type IntegrationsResponse = {
    providers: Array<{
        key: 'obs' | 'twitch' | 'youtube' | 'discord' | 'webhook';
        isConnected: boolean;
        updatedAt?: string;
        health: 'healthy' | 'degraded' | 'offline';
        latencyMs?: number;
        rateLimitRemaining?: number;
        syncMode: 'realtime' | 'polling' | 'manual';
    }>;
    syncJobs: Array<{
        id: string;
        provider: 'obs' | 'twitch' | 'youtube' | 'discord' | 'webhook';
        status: 'running' | 'queued' | 'succeeded' | 'failed';
        startedAt: string;
        completedAt?: string;
        recordsProcessed: number;
    }>;
    webhooks: Array<{
        id: string;
        target: string;
        event: 'order.created' | 'stream.started' | 'payout.sent' | 'identity.updated';
        status: 'active' | 'paused' | 'error';
        lastDeliveryAt?: string;
        failureRate: number;
    }>;
    incidents: Array<{
        id: string;
        provider: 'obs' | 'twitch' | 'youtube' | 'discord' | 'webhook';
        severity: 'low' | 'medium' | 'high';
        summary: string;
        openedAt: string;
        resolvedAt?: string;
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
        hardwareKeyEnabled: boolean;
        walletSignatureRequired: boolean;
    };
    identityTrust: {
        kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
        trustTier: 'starter' | 'trusted' | 'institutional';
        submittedAt?: string;
        reviewedAt?: string;
        nextAction: string;
        riskScore: number;
        linkedWallets: Array<{
            address: string;
            network: 'solana' | 'ethereum';
            verified: boolean;
            verifiedAt?: string;
        }>;
        documents: Array<{
            id: string;
            type: 'passport' | 'national_id' | 'proof_of_address' | 'selfie';
            status: 'uploaded' | 'under_review' | 'approved' | 'rejected';
            uploadedAt: string;
            note?: string;
        }>;
        trustSignals: Array<{
            id: string;
            signal: string;
            scoreImpact: number;
            status: 'positive' | 'neutral' | 'negative';
        }>;
        sessionEvents: Array<{
            id: string;
            event: string;
            location: string;
            ip: string;
            risk: 'low' | 'medium' | 'high';
            at: string;
        }>;
    };
};

export type PhantomConnectRequest = {
    publicKey: string;
};

export type PhantomConnectResponse = {
    walletAddress: string;
    challenge: string;
    nonce: string;
    expiresAt: string;
};

export type PhantomVerifyRequest = {
    publicKey: string;
    signature: string;
    challenge: string;
};

export type PhantomVerifyResponse = {
    verified: boolean;
    sessionToken: string;
    userId: string;
    walletAddress: string;
    roles: Array<'creator' | 'viewer' | 'admin'>;
};

export type PhantomLinkRequest = {
    sessionToken: string;
    role: 'creator' | 'viewer' | 'admin';
};

export type PhantomLinkResponse = {
    linked: boolean;
    walletAddress: string;
    role: 'creator' | 'viewer' | 'admin';
    linkedAt: string;
};

export type PhantomCheckoutRequest = {
    sessionToken: string;
    orderId: string;
    amount: number;
    currency: 'USDC' | 'STREAMING';
};

export type PhantomCheckoutResponse = {
    accepted: boolean;
    walletAddress: string;
    orderId: string;
    amount: number;
    currency: 'USDC' | 'STREAMING';
    transactionSignature: string;
    receiptId: string;
    confirmedAt: string;
};

export type OverlayConfigRequest = {
    creatorId: string;
};

export type OverlayConfigResponse = {
    creatorId: string;
    channel: string;
    token: string;
    tokenStatus: 'active' | 'revoked' | 'expired';
    themeKey: 'neon' | 'midnight' | 'sunset';
    themeVariables: Record<string, string>;
    animationClass: 'anim-soft' | 'anim-sharp' | 'anim-none';
    layoutPreset: 'compact' | 'balanced' | 'cinematic';
    soundPack: 'none' | 'classic' | 'pulse';
    updatedAt: string;
};

export type OverlayThemeUpdateRequest = {
    creatorId: string;
    themeKey: 'neon' | 'midnight' | 'sunset';
};

export type OverlayEventsRequest = {
    creatorId: string;
    token: string;
    sinceSequence?: number;
    connectionMeta?: {
        ip?: string;
        userAgent?: string;
    };
};

export type OverlayEvent = {
    id: string;
    sequence: number;
    type: 'alert' | 'chat' | 'ticker' | 'goal';
    message: string;
    createdAt: string;
};

export type OverlayEventsResponse = {
    channel: string;
    connected: boolean;
    events: OverlayEvent[];
    nextSequence: number;
};

export type OverlayTokenRequest = {
    creatorId: string;
};

export type OverlayTokenResponse = {
    creatorId: string;
    token: string;
    status: 'active' | 'revoked';
    rotatedAt?: string;
    revokedAt?: string;
};
