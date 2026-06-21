import { calculateSplit } from '@livestreamlab/engines/autosplit/calculateSplit';
import { distributeSplit } from '@livestreamlab/engines/autosplit/distribute';
import { trackClick } from '@livestreamlab/engines/affiliate/clickTracker';
import { trackConversion } from '@livestreamlab/engines/affiliate/conversionTracker';
import { estimateRevenue } from '@livestreamlab/engines/affiliate/revenueEstimator';
import type { AffiliateResponse, AutoSplitResponse } from '@livestreamlab/shared/types/DashboardApi';

export const getAutoSplitResponse = async (): Promise<AutoSplitResponse> => {
    const baseSplit = calculateSplit(100);
    const now = new Date().toISOString();

    const defaultAllocations = [
        {
            wallet: 'wallet-creator-main',
            party: 'Creator',
            percentage: baseSplit[0] ?? 70,
        },
        {
            wallet: 'wallet-platform',
            party: 'Platform',
            percentage: 20,
        },
        {
            wallet: 'wallet-editor',
            party: 'Editor',
            percentage: 10,
        },
    ];

    const affiliateAllocations = [
        {
            wallet: 'wallet-creator-main',
            party: 'Creator',
            percentage: 60,
        },
        {
            wallet: 'wallet-affiliate-partner',
            party: 'Affiliate Partner',
            percentage: 10,
        },
        {
            wallet: 'wallet-platform',
            party: 'Platform',
            percentage: 20,
        },
        {
            wallet: 'wallet-editor',
            party: 'Editor',
            percentage: 10,
        },
    ];

    await distributeSplit(defaultAllocations.map((allocation) => allocation.percentage));

    const sampleRevenue = 1200;
    const appliedRule = affiliateAllocations;

    return {
        rules: [
            {
                id: 'rule-001',
                name: 'Default Revenue Split',
                isEnabled: true,
                trigger: {
                    type: 'default',
                    operator: 'eq',
                    value: 1,
                    description: 'Applies to all standard stream revenue events',
                },
                allocations: defaultAllocations,
                updatedAt: now,
            },
            {
                id: 'rule-002',
                name: 'Long Stream Bonus Route',
                isEnabled: true,
                trigger: {
                    type: 'stream_duration_hours',
                    operator: 'gte',
                    value: 2,
                    description: 'If stream duration >= 2h, prioritize creator share',
                },
                allocations: [
                    {
                        wallet: 'wallet-creator-main',
                        party: 'Creator',
                        percentage: 60,
                    },
                    {
                        wallet: 'wallet-platform',
                        party: 'Platform',
                        percentage: 25,
                    },
                    {
                        wallet: 'wallet-editor',
                        party: 'Editor',
                        percentage: 15,
                    },
                ],
                updatedAt: now,
            },
            {
                id: 'rule-003',
                name: 'Affiliate Conversion Rule',
                isEnabled: true,
                trigger: {
                    type: 'affiliate_sale',
                    operator: 'eq',
                    value: 1,
                    description: 'If affiliate sale event triggers, route partner commission',
                },
                allocations: affiliateAllocations,
                updatedAt: now,
            },
        ],
        ruleHistory: [
            {
                id: 'hist-001',
                ruleId: 'rule-001',
                action: 'created',
                at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
                summary: 'Default split initialized with creator/platform/editor parties',
            },
            {
                id: 'hist-002',
                ruleId: 'rule-002',
                action: 'updated',
                at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                summary: 'Stream duration threshold adjusted from 3h to 2h',
            },
            {
                id: 'hist-003',
                ruleId: 'rule-003',
                action: 'created',
                at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
                summary: 'Affiliate commission route introduced for partner marketplace',
            },
        ],
        simulation: {
            sampleRevenue,
            appliedRuleId: 'rule-003',
            result: appliedRule.map((allocation) => ({
                party: allocation.party,
                amount: Number(((allocation.percentage / 100) * sampleRevenue).toFixed(2)),
                percentage: allocation.percentage,
            })),
        },
    };
};

export const getAffiliateResponse = async (): Promise<AffiliateResponse> => {
    const productId = await trackClick('product-001');
    const conversionId = await trackConversion('order-001');

    const catalog = [
        {
            id: 'product-001',
            name: 'Creator Bundle',
            category: 'Digital Pack',
            price: 49,
            commissionRate: 0.2,
            rating: 4.8,
        },
        {
            id: 'product-002',
            name: 'Studio Lighting Kit',
            category: 'Hardware',
            price: 129,
            commissionRate: 0.15,
            rating: 4.6,
        },
        {
            id: 'product-003',
            name: 'Audience Growth Course',
            category: 'Education',
            price: 89,
            commissionRate: 0.22,
            rating: 4.9,
        },
    ];

    const links = [
        {
            id: conversionId,
            productId,
            productName: 'Creator Bundle',
            shortUrl: 'https://livestreamlab.live/a/creator-bundle',
            clicks: 42,
            conversions: 12,
            earnings: estimateRevenue(42, 0.8),
        },
        {
            id: 'conv-002',
            productId: 'product-002',
            productName: 'Studio Lighting Kit',
            shortUrl: 'https://livestreamlab.live/a/studio-lighting-kit',
            clicks: 36,
            conversions: 8,
            earnings: estimateRevenue(36, 1.35),
        },
        {
            id: 'conv-003',
            productId: 'product-003',
            productName: 'Audience Growth Course',
            shortUrl: 'https://livestreamlab.live/a/audience-growth-course',
            clicks: 50,
            conversions: 16,
            earnings: estimateRevenue(50, 1.65),
        },
    ];

    const topProducts = links.map((link) => ({
        productId: link.productId,
        productName: link.productName,
        conversionRate: link.clicks > 0 ? Number(((link.conversions / link.clicks) * 100).toFixed(2)) : 0,
        earnings: link.earnings,
    })).sort((left, right) => right.earnings - left.earnings);

    const conversionTrend = [
        { label: 'D-6', conversions: 4, earnings: 38 },
        { label: 'D-5', conversions: 6, earnings: 52 },
        { label: 'D-4', conversions: 7, earnings: 69 },
        { label: 'D-3', conversions: 8, earnings: 76 },
        { label: 'D-2', conversions: 9, earnings: 94 },
        { label: 'D-1', conversions: 11, earnings: 108 },
        { label: 'Today', conversions: 14, earnings: 132 },
    ];

    const generatorBaseUrl = 'https://livestreamlab.live/a';

    return {
        links,
        catalog,
        topProducts,
        conversionTrend,
        generator: {
            baseUrl: generatorBaseUrl,
            defaultCampaign: 'creator-launch',
            lastGeneratedUrl: `${generatorBaseUrl}/creator-bundle?campaign=creator-launch`,
        },
    };
};

