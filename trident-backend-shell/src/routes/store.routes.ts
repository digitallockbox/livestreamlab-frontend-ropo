import { calculateSplit } from '@livestreamlab/engines/autosplit/calculateSplit';
import { distributeSplit } from '@livestreamlab/engines/autosplit/distribute';
import { trackClick } from '@livestreamlab/engines/affiliate/clickTracker';
import { trackConversion } from '@livestreamlab/engines/affiliate/conversionTracker';
import { estimateRevenue } from '@livestreamlab/engines/affiliate/revenueEstimator';
import type { AffiliateResponse, AutoSplitResponse } from '@livestreamlab/shared/types/DashboardApi';

export const getAutoSplitResponse = async (): Promise<AutoSplitResponse> => {
    const allocations = calculateSplit(100).map((percentage, index) => ({
        wallet: `wallet-${index + 1}`,
        percentage,
    }));

    await distributeSplit(allocations.map((allocation) => allocation.percentage));

    return {
        rules: [
            {
                id: 'rule-001',
                name: 'Default Split',
                isEnabled: true,
                allocations,
            },
        ],
    };
};

export const getAffiliateResponse = async (): Promise<AffiliateResponse> => {
    const productId = await trackClick('product-001');
    const conversionId = await trackConversion('order-001');
    const earnings = estimateRevenue(42, 0.8);

    return {
        links: [
            {
                id: conversionId,
                productId,
                productName: 'Creator Bundle',
                shortUrl: 'https://livestreamlab.live/a/creator-bundle',
                clicks: 42,
                conversions: 12,
                earnings,
            },
        ],
    };
};

