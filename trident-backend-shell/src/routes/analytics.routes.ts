import { productAnalytics } from '@livestreamlab/core/analytics/productAnalytics';
import { streamAnalytics } from '@livestreamlab/core/analytics/streamAnalytics';
import { estimateRevenue } from '@livestreamlab/engines/affiliate/revenueEstimator';
import type { AnalyticsResponse } from '@livestreamlab/shared/types/DashboardApi';

export const getAnalyticsResponse = async (): Promise<AnalyticsResponse> => {
    const [product, stream] = await Promise.all([
        productAnalytics(),
        streamAnalytics(),
    ]);

    const views = product.views ?? 0;
    const watchers = stream.watchers ?? 0;
    const conversionRate = views > 0 ? Math.min(100, (watchers / views) * 100) : 0;
    const revenue = estimateRevenue(views, 0.35);

    return {
        generatedAt: new Date().toISOString(),
        range: '7d',
        overview: {
            totalViews: views,
            uniqueViewers: watchers,
            watchTimeMinutes: watchers * 12,
            conversionRate,
            revenue,
        },
        topContent: [
            {
                streamId: 'stream-001',
                title: 'Weekly Creator Session',
                views,
                revenue,
            },
        ],
    };
};

