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
    return {
        profile: {
            displayName: 'Creator',
            email: 'creator@livestreamlab.live',
            timezone: 'UTC',
        },
        security: {
            twoFactorEnabled: true,
            apiKeysEnabled: true,
        },
    };
};

