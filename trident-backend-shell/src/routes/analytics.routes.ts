import { productAnalytics } from '@livestreamlab/core/analytics/productAnalytics';
import { streamAnalytics } from '@livestreamlab/core/analytics/streamAnalytics';
import { estimateRevenue } from '@livestreamlab/engines/affiliate/revenueEstimator';
import type { AnalyticsResponse } from '@livestreamlab/shared/types/DashboardApi';

export const getAnalyticsResponse = async (): Promise<AnalyticsResponse> => {
    const [product, stream] = await Promise.all([
        productAnalytics(),
        streamAnalytics(),
    ]);

    const views = Math.max(product.views ?? 0, 1800);
    const watchers = Math.max(stream.watchers ?? 0, 620);
    const conversionRate = views > 0 ? Math.min(100, (watchers / views) * 100) : 0;
    const ctr = Math.min(100, conversionRate * 0.78);
    const revenue = estimateRevenue(views, 0.35);
    const rpm = views > 0 ? (revenue / views) * 1000 : 0;

    const retentionCurve = [
        { minute: 0, retention: 100 },
        { minute: 5, retention: 82 },
        { minute: 10, retention: 71 },
        { minute: 20, retention: 58 },
        { minute: 30, retention: 47 },
        { minute: 45, retention: 35 },
        { minute: 60, retention: 28 },
    ];

    const trafficSources: AnalyticsResponse['trafficSources'] = [
        { source: 'direct', visitors: Math.round(views * 0.36), ctr: 6.4, revenue: revenue * 0.34 },
        { source: 'search', visitors: Math.round(views * 0.28), ctr: 5.9, revenue: revenue * 0.27 },
        { source: 'social', visitors: Math.round(views * 0.18), ctr: 4.7, revenue: revenue * 0.18 },
        { source: 'referral', visitors: Math.round(views * 0.11), ctr: 5.2, revenue: revenue * 0.12 },
        { source: 'partner', visitors: Math.round(views * 0.07), ctr: 7.5, revenue: revenue * 0.09 },
    ];

    const viewerGeography = [
        { countryCode: 'US', country: 'United States', viewers: Math.round(watchers * 0.43), revenue: revenue * 0.44 },
        { countryCode: 'GB', country: 'United Kingdom', viewers: Math.round(watchers * 0.14), revenue: revenue * 0.13 },
        { countryCode: 'BR', country: 'Brazil', viewers: Math.round(watchers * 0.12), revenue: revenue * 0.1 },
        { countryCode: 'DE', country: 'Germany', viewers: Math.round(watchers * 0.1), revenue: revenue * 0.12 },
        { countryCode: 'IN', country: 'India', viewers: Math.round(watchers * 0.21), revenue: revenue * 0.21 },
    ];

    const streamPerformanceHeatmap: AnalyticsResponse['streamPerformanceHeatmap'] = [
        { day: 'Mon', hour: 18, score: 58 },
        { day: 'Tue', hour: 19, score: 62 },
        { day: 'Wed', hour: 20, score: 71 },
        { day: 'Thu', hour: 20, score: 77 },
        { day: 'Fri', hour: 21, score: 83 },
        { day: 'Sat', hour: 21, score: 92 },
        { day: 'Sun', hour: 17, score: 69 },
    ];

    const earningsOverTime = [
        { label: 'D-6', earnings: revenue * 0.09 },
        { label: 'D-5', earnings: revenue * 0.11 },
        { label: 'D-4', earnings: revenue * 0.14 },
        { label: 'D-3', earnings: revenue * 0.12 },
        { label: 'D-2', earnings: revenue * 0.16 },
        { label: 'D-1', earnings: revenue * 0.17 },
        { label: 'Today', earnings: revenue * 0.21 },
    ];

    return {
        generatedAt: new Date().toISOString(),
        range: '7d',
        overview: {
            totalViews: views,
            uniqueViewers: watchers,
            watchTimeMinutes: watchers * 12,
            conversionRate,
            ctr,
            rpm,
            revenue,
        },
        topContent: [
            {
                streamId: 'stream-001',
                title: 'Weekly Creator Session',
                views: Math.round(views * 0.34),
                revenue: revenue * 0.38,
            },
            {
                streamId: 'stream-002',
                title: 'Behind the Build: Monetization Playbook',
                views: Math.round(views * 0.28),
                revenue: revenue * 0.24,
            },
            {
                streamId: 'stream-003',
                title: 'Creator Q&A Live',
                views: Math.round(views * 0.19),
                revenue: revenue * 0.2,
            },
        ],
        retentionCurve,
        trafficSources,
        viewerGeography,
        streamPerformanceHeatmap,
        earningsOverTime,
    };
};

