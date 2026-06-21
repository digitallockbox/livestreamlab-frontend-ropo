import { useEffect, useMemo, useState } from 'react';
import { dashboardApi } from '../utils/dashboardApi';
import { logger } from '../utils/logger';
import { PLATFORM_ORIGINS } from '@livestreamlab/shared/constants/endpoints';
import type { OverlayConfigResponse, OverlayEvent } from '@livestreamlab/shared/types/DashboardApi';

type RuntimeStatus =
    | 'loading'
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'invalid-token'
    | 'no-events'
    | 'event-burst';

type UseOverlayRuntimeState = {
    config: OverlayConfigResponse | null;
    events: OverlayEvent[];
    status: RuntimeStatus;
    error: string | null;
    runtimeClassName: string;
    saveTheme: (themeKey: OverlayConfigResponse['themeKey']) => Promise<void>;
    rotateToken: () => Promise<void>;
    revokeToken: () => Promise<void>;
    refresh: () => Promise<void>;
};

type OverlayRuntimeMode = 'live' | 'preview';

type UseOverlayRuntimeOptions = {
    mode?: OverlayRuntimeMode;
};

type OverlaySocketMessage = {
    type: 'alert.follow' | 'alert.donation' | 'chat.message' | 'goal.update' | 'system.connected' | 'system.disconnected' | 'system.error';
    message: string;
    createdAt?: string;
};

type OverlayPreviewMessage = {
    source: 'overlay-editor';
    mode: 'preview';
    type: 'theme.update' | 'event.mock' | 'token.rotated' | 'token.revoked';
    payload?: {
        themeKey?: OverlayConfigResponse['themeKey'];
        message?: string;
        eventType?: OverlayEvent['type'];
        token?: string;
    };
};

export const useOverlayRuntime = (
    creatorId: string,
    options?: UseOverlayRuntimeOptions,
): UseOverlayRuntimeState => {
    const mode = options?.mode ?? 'live';
    const [config, setConfig] = useState<OverlayConfigResponse | null>(null);
    const [events, setEvents] = useState<OverlayEvent[]>([]);
    const [status, setStatus] = useState<RuntimeStatus>('loading');
    const [error, setError] = useState<string | null>(null);
    const [socketGeneration, setSocketGeneration] = useState(0);

    const runtimeClassName = useMemo(() => {
        const theme = config?.themeKey ?? 'neon';
        return `overlay-preview overlay-preview-${theme}`;
    }, [config?.themeKey]);

    const loadConfig = async (): Promise<OverlayConfigResponse | null> => {
        try {
            const nextConfig = await dashboardApi.getOverlayConfig({ creatorId });
            setConfig(nextConfig);
            setError(null);
            logger.info('overlay.runtime.loaded', { creatorId });
            return nextConfig;
        } catch (err) {
            setError('Failed to load overlay configuration');
            logger.error('overlay.runtime.error', {
                creatorId,
                error: err instanceof Error ? err.message : String(err),
            });
            return null;
        }
    };

    const connectRuntimeSocket = (token: string): (() => void) => {
        setStatus('connecting');
        const wsBase = PLATFORM_ORIGINS.ws.replace(/\/$/, '');
        const socketUrl = `${wsBase}/ws/overlay/${creatorId}/${token}`;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let noEventTimer: ReturnType<typeof setTimeout> | null = null;
        let forceClosed = false;

        const socket = new WebSocket(socketUrl);

        socket.addEventListener('open', () => {
            setStatus('connected');
            setError(null);
            logger.info('overlay.runtime.connected', { creatorId, transport: 'websocket' });
            noEventTimer = setTimeout(() => {
                setStatus('no-events');
            }, 4000);
        });

        socket.addEventListener('message', (event) => {
            try {
                const parsed = JSON.parse(String(event.data)) as OverlaySocketMessage;
                const timestamp = parsed.createdAt ?? new Date().toISOString();

                const mappedType: OverlayEvent['type'] =
                    parsed.type.startsWith('alert')
                        ? 'alert'
                        : parsed.type.startsWith('chat')
                            ? 'chat'
                            : parsed.type.startsWith('goal')
                                ? 'goal'
                                : 'ticker';

                const nextEvent: OverlayEvent = {
                    id: `ws-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
                    sequence: Date.now(),
                    type: mappedType,
                    message: parsed.message,
                    createdAt: timestamp,
                };

                if (noEventTimer) {
                    clearTimeout(noEventTimer);
                    noEventTimer = null;
                }

                setEvents((previous) => {
                    const nextList = [nextEvent, ...previous].slice(0, 40);
                    if (nextList.length >= 30) {
                        setStatus('event-burst');
                    } else {
                        setStatus('connected');
                    }
                    return nextList;
                });
                logger.info('overlay.runtime.event.rendered', {
                    creatorId,
                    eventType: parsed.type,
                });
            } catch (err) {
                logger.error('overlay.runtime.error', {
                    creatorId,
                    error: err instanceof Error ? err.message : String(err),
                });
            }
        });

        socket.addEventListener('close', (event) => {
            if (forceClosed) {
                return;
            }

            if (event.code === 1008) {
                setStatus('invalid-token');
                return;
            }

            setStatus('disconnected');
            reconnectTimer = setTimeout(() => {
                setSocketGeneration((previous) => previous + 1);
            }, 1500);
        });

        socket.addEventListener('error', () => {
            setStatus('disconnected');
            logger.error('overlay.runtime.error', {
                creatorId,
                error: 'websocket-error',
            });
        });

        return () => {
            forceClosed = true;
            if (reconnectTimer) {
                clearTimeout(reconnectTimer);
            }
            if (noEventTimer) {
                clearTimeout(noEventTimer);
            }
            socket.close();
        };
    };

    const startPreviewBridge = (): (() => void) => {
        setStatus('connected');
        logger.info('overlay.runtime.loaded', { creatorId, mode: 'preview' });

        const onMessage = (event: MessageEvent): void => {
            const payload = event.data as OverlayPreviewMessage;
            if (!payload || payload.source !== 'overlay-editor' || payload.mode !== 'preview') {
                return;
            }

            if (payload.type === 'theme.update' && payload.payload?.themeKey) {
                const nextTheme = payload.payload.themeKey;
                setConfig((previous) => {
                    if (!previous) {
                        return previous;
                    }

                    return {
                        ...previous,
                        themeKey: nextTheme,
                    };
                });
                return;
            }

            if (payload.type === 'token.revoked') {
                setStatus('invalid-token');
                return;
            }

            if (payload.type === 'token.rotated' && payload.payload?.token) {
                const nextToken = payload.payload.token;
                setConfig((previous) => {
                    if (!previous) {
                        return previous;
                    }

                    return {
                        ...previous,
                        token: nextToken,
                        tokenStatus: 'active',
                    };
                });
                return;
            }

            if (payload.type === 'event.mock') {
                const nextEvent: OverlayEvent = {
                    id: `preview-${Date.now()}`,
                    sequence: Date.now(),
                    type: payload.payload?.eventType ?? 'chat',
                    message: payload.payload?.message ?? 'preview event',
                    createdAt: new Date().toISOString(),
                };
                setEvents((previous) => [nextEvent, ...previous].slice(0, 40));
            }
        };

        window.addEventListener('message', onMessage);
        return () => {
            window.removeEventListener('message', onMessage);
        };
    };

    const refresh = async (): Promise<void> => {
        const nextConfig = await loadConfig();
        if (!nextConfig) {
            return;
        }
        setSocketGeneration((previous) => previous + 1);
    };

    const saveTheme = async (themeKey: OverlayConfigResponse['themeKey']): Promise<void> => {
        const next = await dashboardApi.saveOverlayTheme({ creatorId, themeKey });
        setConfig(next);
        setError(null);
        logger.info('overlay.theme.saved', { creatorId, themeKey });
    };

    const rotateToken = async (): Promise<void> => {
        const rotated = await dashboardApi.rotateOverlayToken({ creatorId });
        setConfig((previous) =>
            previous
                ? {
                    ...previous,
                    token: rotated.token,
                    tokenStatus: 'active',
                    updatedAt: rotated.rotatedAt ?? previous.updatedAt,
                }
                : previous,
        );
        logger.info('overlay.token.rotated', { creatorId });
        setSocketGeneration((previous) => previous + 1);
    };

    const revokeToken = async (): Promise<void> => {
        await dashboardApi.revokeOverlayToken({ creatorId });
        setStatus('invalid-token');
        setConfig((previous) =>
            previous
                ? {
                    ...previous,
                    tokenStatus: 'revoked',
                }
                : previous,
        );
        logger.warn('overlay.runtime.error', { creatorId, reason: 'token-revoked' });
    };

    useEffect(() => {
        if (mode !== 'preview') {
            return () => {
                // no-op for live mode in this effect
            };
        }

        void loadConfig();
        return startPreviewBridge();
    }, [creatorId, mode]);

    useEffect(() => {
        if (mode !== 'live') {
            return () => {
                // no-op for preview mode
            };
        }

        let isMounted = true;
        let cleanupSocket: (() => void) | null = null;

        const start = async (): Promise<void> => {
            const nextConfig = await loadConfig();
            if (!isMounted || !nextConfig) {
                return;
            }

            if (nextConfig.tokenStatus !== 'active') {
                setStatus('invalid-token');
                return;
            }

            cleanupSocket = connectRuntimeSocket(nextConfig.token);
        };

        void start();

        return () => {
            isMounted = false;
            if (cleanupSocket) {
                cleanupSocket();
            }
        };
    }, [creatorId, mode, socketGeneration]);

    return {
        config,
        events,
        status,
        error,
        runtimeClassName,
        saveTheme,
        rotateToken,
        revokeToken,
        refresh: async () => {
            await refresh();
        },
    };
};
