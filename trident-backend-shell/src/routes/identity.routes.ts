import { startHlsIngest } from '@livestreamlab/engines/ingest/hls';
import { startRtmpIngest } from '@livestreamlab/engines/ingest/rtmp';
import { startWebsocketNotifier } from '@livestreamlab/engines/notifications/websocket';
import type { IntegrationsResponse, SettingsResponse } from '@livestreamlab/shared/types/DashboardApi';

export const getIntegrationsResponse = async (): Promise<IntegrationsResponse> => {
    const [hls, rtmp] = await Promise.all([startHlsIngest(), startRtmpIngest()]);
    const websocket = startWebsocketNotifier();
    const updatedAt = new Date().toISOString();

    return {
        providers: [
            { key: 'obs', isConnected: hls, updatedAt },
            { key: 'youtube', isConnected: rtmp, updatedAt },
            { key: 'webhook', isConnected: websocket, updatedAt },
            { key: 'discord', isConnected: false },
            { key: 'twitch', isConnected: false },
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

