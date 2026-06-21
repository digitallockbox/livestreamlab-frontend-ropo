import { calcAffiliateEarnings } from '@livestreamlab/core/earnings/affiliateEarnings';
import { calcHybridEarnings } from '@livestreamlab/core/earnings/hybridEarnings';
import { calcStreamingEarnings } from '@livestreamlab/core/earnings/streamingEarnings';
import { getBalance } from '@livestreamlab/engines/solana/balance';
import type { EarningsResponse } from '@livestreamlab/shared/types/DashboardApi';

export const getEarningsResponse = async (): Promise<EarningsResponse> => {
    const chainBalance = await getBalance();
    const streaming = calcStreamingEarnings(1200);
    const affiliate = calcAffiliateEarnings(340);
    const lifetime = calcHybridEarnings(streaming, affiliate);

    return {
        currency: 'USD',
        availableBalance: chainBalance + 500,
        pendingBalance: 120,
        lifetimeEarnings: lifetime,
        payouts: [
            {
                payoutId: 'pay-001',
                createdAt: new Date().toISOString(),
                amount: 300,
                status: 'sent',
            },
        ],
    };
};

