import { startHlsIngest } from '@livestreamlab/engines/ingest/hls';
import { startRtmpIngest } from '@livestreamlab/engines/ingest/rtmp';
import { startWebsocketNotifier } from '@livestreamlab/engines/notifications/websocket';
import type { IntegrationsResponse, SettingsResponse } from '@livestreamlab/shared/types/DashboardApi';

export const getIntegrationsResponse = async (): Promise<IntegrationsResponse> => {
    const [hls, rtmp] = await Promise.all([startHlsIngest(), startRtmpIngest()]);
    const websocket = startWebsocketNotifier();
    const now = Date.now();
    const oneMinuteMs = 60 * 1000;
    const updatedAt = new Date(now).toISOString();

    return {
        providers: [
            {
                key: 'obs',
                isConnected: hls,
                updatedAt,
                health: hls ? 'healthy' : 'degraded',
                latencyMs: 42,
                rateLimitRemaining: 954,
                syncMode: 'realtime',
            },
            {
                key: 'youtube',
                isConnected: rtmp,
                updatedAt,
                health: rtmp ? 'healthy' : 'degraded',
                latencyMs: 121,
                rateLimitRemaining: 412,
                syncMode: 'polling',
            },
            {
                key: 'webhook',
                isConnected: websocket,
                updatedAt,
                health: websocket ? 'healthy' : 'offline',
                latencyMs: websocket ? 58 : undefined,
                rateLimitRemaining: 1288,
                syncMode: 'realtime',
            },
            {
                key: 'discord',
                isConnected: false,
                updatedAt,
                health: 'degraded',
                latencyMs: 190,
                rateLimitRemaining: 64,
                syncMode: 'manual',
            },
            {
                key: 'twitch',
                isConnected: false,
                updatedAt,
                health: 'offline',
                syncMode: 'manual',
            },
        ],
        syncJobs: [
            {
                id: 'job-001',
                provider: 'youtube',
                status: 'running',
                startedAt: new Date(now - oneMinuteMs * 4).toISOString(),
                recordsProcessed: 684,
            },
            {
                id: 'job-002',
                provider: 'webhook',
                status: 'queued',
                startedAt: new Date(now + oneMinuteMs * 2).toISOString(),
                recordsProcessed: 0,
            },
            {
                id: 'job-003',
                provider: 'obs',
                status: 'succeeded',
                startedAt: new Date(now - oneMinuteMs * 37).toISOString(),
                completedAt: new Date(now - oneMinuteMs * 31).toISOString(),
                recordsProcessed: 1284,
            },
            {
                id: 'job-004',
                provider: 'discord',
                status: 'failed',
                startedAt: new Date(now - oneMinuteMs * 51).toISOString(),
                completedAt: new Date(now - oneMinuteMs * 47).toISOString(),
                recordsProcessed: 32,
            },
        ],
        webhooks: [
            {
                id: 'wh-001',
                target: 'https://hooks.partner.io/events',
                event: 'order.created',
                status: 'active',
                lastDeliveryAt: new Date(now - oneMinuteMs * 6).toISOString(),
                failureRate: 0.2,
            },
            {
                id: 'wh-002',
                target: 'https://ops.livestreamlab.live/webhooks/payouts',
                event: 'payout.sent',
                status: 'active',
                lastDeliveryAt: new Date(now - oneMinuteMs * 15).toISOString(),
                failureRate: 0.1,
            },
            {
                id: 'wh-003',
                target: 'https://identity-monitoring.company.net/stream',
                event: 'identity.updated',
                status: 'error',
                lastDeliveryAt: new Date(now - oneMinuteMs * 49).toISOString(),
                failureRate: 8.6,
            },
        ],
        incidents: [
            {
                id: 'incident-001',
                provider: 'discord',
                severity: 'medium',
                summary: 'Bot token rotated and requires reconnect.',
                openedAt: new Date(now - oneMinuteMs * 78).toISOString(),
            },
            {
                id: 'incident-002',
                provider: 'webhook',
                severity: 'low',
                summary: 'Intermittent 429s from identity callback target.',
                openedAt: new Date(now - oneMinuteMs * 143).toISOString(),
                resolvedAt: new Date(now - oneMinuteMs * 95).toISOString(),
            },
        ],
    };
};

export const getSettingsResponse = async (): Promise<SettingsResponse> => {
    const now = Date.now();
    const oneHourMs = 60 * 60 * 1000;

    return {
        profile: {
            displayName: 'Creator',
            email: 'creator@livestreamlab.live',
            timezone: 'UTC',
        },
        security: {
            twoFactorEnabled: true,
            apiKeysEnabled: true,
            hardwareKeyEnabled: true,
            walletSignatureRequired: true,
        },
        identityTrust: {
            kycStatus: 'pending',
            trustTier: 'trusted',
            submittedAt: new Date(now - oneHourMs * 28).toISOString(),
            reviewedAt: new Date(now - oneHourMs * 4).toISOString(),
            nextAction: 'Upload a proof of address document to finalize verification.',
            riskScore: 23,
            linkedWallets: [
                {
                    address: '9uEJc...A3kP',
                    network: 'solana',
                    verified: true,
                    verifiedAt: new Date(now - oneHourMs * 30).toISOString(),
                },
                {
                    address: '0x8aF3...2B19',
                    network: 'ethereum',
                    verified: false,
                },
            ],
            documents: [
                {
                    id: 'doc-001',
                    type: 'passport',
                    status: 'approved',
                    uploadedAt: new Date(now - oneHourMs * 29).toISOString(),
                },
                {
                    id: 'doc-002',
                    type: 'selfie',
                    status: 'approved',
                    uploadedAt: new Date(now - oneHourMs * 28).toISOString(),
                },
                {
                    id: 'doc-003',
                    type: 'proof_of_address',
                    status: 'under_review',
                    uploadedAt: new Date(now - oneHourMs * 3).toISOString(),
                    note: 'Utility bill requires clearer corner crop.',
                },
            ],
            trustSignals: [
                {
                    id: 'signal-001',
                    signal: 'Consistent wallet ownership signatures',
                    scoreImpact: 18,
                    status: 'positive',
                },
                {
                    id: 'signal-002',
                    signal: 'Low dispute ratio on payouts',
                    scoreImpact: 9,
                    status: 'positive',
                },
                {
                    id: 'signal-003',
                    signal: 'Recent login from new region',
                    scoreImpact: -4,
                    status: 'negative',
                },
            ],
            sessionEvents: [
                {
                    id: 'session-001',
                    event: 'Wallet challenge approved',
                    location: 'Berlin, DE',
                    ip: '91.203.11.42',
                    risk: 'low',
                    at: new Date(now - oneHourMs * 2).toISOString(),
                },
                {
                    id: 'session-002',
                    event: 'Password reset requested',
                    location: 'Berlin, DE',
                    ip: '91.203.11.42',
                    risk: 'medium',
                    at: new Date(now - oneHourMs * 9).toISOString(),
                },
                {
                    id: 'session-003',
                    event: 'Login challenge failed',
                    location: 'Warsaw, PL',
                    ip: '83.21.144.9',
                    risk: 'high',
                    at: new Date(now - oneHourMs * 17).toISOString(),
                },
            ],
        },
    };
};

