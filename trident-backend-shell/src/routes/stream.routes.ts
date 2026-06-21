import { streamEvents } from '@livestreamlab/core/stream/streamEvents';
import type { StreamsResponse } from '@livestreamlab/shared/types/DashboardApi';

export const getStreamsResponse = async (): Promise<StreamsResponse> => {
    const now = new Date().toISOString();
    const hasEvents = streamEvents.length > 0;
    const overlayToken = `ovl_${Date.now().toString(36)}`;

    const streams = hasEvents
        ? streamEvents.map((_, index) => ({
            id: `stream-${index + 1}`,
            title: `Live Session ${index + 1}`,
            status: index === 0 ? 'live' as const : 'ended' as const,
            startedAt: now,
            viewersPeak: 80 + index * 15,
        }))
        : [
            {
                id: 'stream-001',
                title: 'Creator Kickoff',
                status: 'live' as const,
                startedAt: now,
                viewersPeak: 140,
            },
            {
                id: 'stream-002',
                title: 'Merch Drop Teaser',
                status: 'scheduled' as const,
                scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
            },
        ];

    return {
        streams,
        overlays: {
            overlayToken,
            channel: 'creator-main',
            themePresets: [
                {
                    key: 'neon',
                    name: 'Neon Pulse',
                    accent: '#22d3ee',
                    background: '#08121f',
                },
                {
                    key: 'midnight',
                    name: 'Midnight Console',
                    accent: '#60a5fa',
                    background: '#060b16',
                },
                {
                    key: 'sunset',
                    name: 'Sunset Glow',
                    accent: '#fb923c',
                    background: '#1a0f0b',
                },
            ],
            browserSourceUrls: {
                alertBox: `https://cdn.livestreamlab.live:8080/overlay/alert-box?token=${overlayToken}`,
                chatOverlay: `https://cdn.livestreamlab.live:8080/overlay/chat?token=${overlayToken}`,
                eventTicker: `https://cdn.livestreamlab.live:8080/overlay/ticker?token=${overlayToken}`,
                streamGoal: `https://cdn.livestreamlab.live:8080/overlay/goal?token=${overlayToken}`,
            },
            widgets: [
                {
                    id: 'widget-alert',
                    type: 'alert_box',
                    title: 'Alert Box',
                    enabled: true,
                    sampleText: 'New follow from creator_fan_42',
                },
                {
                    id: 'widget-chat',
                    type: 'chat_overlay',
                    title: 'Chat Overlay',
                    enabled: true,
                    sampleText: 'chat: this stream is fire',
                },
                {
                    id: 'widget-ticker',
                    type: 'event_ticker',
                    title: 'Event Ticker',
                    enabled: true,
                    sampleText: 'Latest event: 5 gifted subs',
                },
                {
                    id: 'widget-goal',
                    type: 'stream_goal',
                    title: 'Stream Goal',
                    enabled: true,
                    sampleText: 'Follower goal 420 / 500',
                },
            ],
            goals: [
                {
                    id: 'goal-follows',
                    name: 'Follower Goal',
                    current: 420,
                    target: 500,
                },
                {
                    id: 'goal-donations',
                    name: 'Donation Goal (USD)',
                    current: 710,
                    target: 1000,
                },
            ],
            recentEvents: [
                {
                    id: 'event-1',
                    type: 'follow',
                    viewer: 'creator_fan_42',
                    at: now,
                },
                {
                    id: 'event-2',
                    type: 'donation',
                    viewer: 'tip_master',
                    amount: 25,
                    at: now,
                },
                {
                    id: 'event-3',
                    type: 'sub',
                    viewer: 'loyal_subscriber',
                    at: now,
                },
            ],
        },
    };
};

