import { logError, logInfo, logWarn } from '../utils/logger';

export type OverlayConfigRequest = {
    creatorId: string;
};

export type OverlayConfigResponse = {
    creatorId: string;
    channel: string;
    token: string;
    tokenStatus: 'active' | 'revoked' | 'expired';
    themeKey: 'neon' | 'midnight' | 'sunset';
    themeVariables: Record<string, string>;
    animationClass: 'anim-soft' | 'anim-sharp' | 'anim-none';
    layoutPreset: 'compact' | 'balanced' | 'cinematic';
    soundPack: 'none' | 'classic' | 'pulse';
    updatedAt: string;
};

export type OverlayThemeUpdateRequest = {
    creatorId: string;
    themeKey: 'neon' | 'midnight' | 'sunset';
};

export type OverlayEventsRequest = {
    creatorId: string;
    token: string;
    sinceSequence?: number;
    connectionMeta?: {
        ip?: string;
        userAgent?: string;
    };
};

export type OverlayEventsResponse = {
    channel: string;
    connected: boolean;
    events: Array<{
        id: string;
        sequence: number;
        type: 'alert' | 'chat' | 'ticker' | 'goal';
        message: string;
        createdAt: string;
    }>;
    nextSequence: number;
};

export type OverlayTokenRequest = {
    creatorId: string;
};

export type OverlayTokenResponse = {
    creatorId: string;
    token: string;
    status: 'active' | 'revoked';
    rotatedAt?: string;
    revokedAt?: string;
};

type OverlayStoreRecord = {
    creatorId: string;
    publicKey: string;
    channel: string;
    token: string;
    tokenExpiresAt: string;
    scopes: string[];
    tokenStatus: 'active' | 'revoked' | 'expired';
    themeKey: 'neon' | 'midnight' | 'sunset';
    themeVariables: Record<string, string>;
    animationClass: 'anim-soft' | 'anim-sharp' | 'anim-none';
    layoutPreset: 'compact' | 'balanced' | 'cinematic';
    soundPack: 'none' | 'classic' | 'pulse';
    updatedAt: string;
    sequence: number;
};

const overlayStore = new Map<string, OverlayStoreRecord>();

const ensureOverlayRecord = (creatorId: string): OverlayStoreRecord => {
    const existing = overlayStore.get(creatorId);
    if (existing) {
        return existing;
    }

    const record: OverlayStoreRecord = {
        creatorId,
        publicKey: `pk_${creatorId}`,
        channel: `${creatorId}-main`,
        token: `ovl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
        tokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
        scopes: ['overlay:read', 'overlay:events'],
        tokenStatus: 'active',
        themeKey: 'neon',
        themeVariables: {
            '--overlay-accent': '#22d3ee',
            '--overlay-bg': '#08121f',
            '--overlay-text': '#e2e8f0',
        },
        animationClass: 'anim-soft',
        layoutPreset: 'balanced',
        soundPack: 'pulse',
        updatedAt: new Date().toISOString(),
        sequence: 1,
    };

    overlayStore.set(creatorId, record);
    return record;
};

const validateOverlayToken = (
    record: OverlayStoreRecord,
    token: string,
): 'valid' | 'invalid' | 'expired' | 'revoked' => {
    if (record.tokenStatus === 'revoked') {
        return 'revoked';
    }

    if (new Date(record.tokenExpiresAt).getTime() <= Date.now()) {
        record.tokenStatus = 'expired';
        return 'expired';
    }

    if (token !== record.token) {
        return 'invalid';
    }

    return 'valid';
};

export const getOverlayConfigResponse = async (
    payload?: OverlayConfigRequest,
): Promise<OverlayConfigResponse> => {
    const request = payload ?? { creatorId: 'creator_default' };
    const record = ensureOverlayRecord(request.creatorId);

    logInfo('overlay.runtime.loaded', {
        creatorId: record.creatorId,
        token: record.token,
        scopes: record.scopes,
    });

    return {
        creatorId: record.creatorId,
        channel: record.channel,
        token: record.token,
        tokenStatus: record.tokenStatus,
        themeKey: record.themeKey,
        themeVariables: record.themeVariables,
        animationClass: record.animationClass,
        layoutPreset: record.layoutPreset,
        soundPack: record.soundPack,
        updatedAt: record.updatedAt,
    };
};

export const saveOverlayThemeResponse = async (
    payload?: OverlayThemeUpdateRequest,
): Promise<OverlayConfigResponse> => {
    const request = payload ?? { creatorId: 'creator_default', themeKey: 'neon' };
    const record = ensureOverlayRecord(request.creatorId);

    record.themeKey = request.themeKey;
    record.updatedAt = new Date().toISOString();

    if (request.themeKey === 'midnight') {
        record.themeVariables = {
            '--overlay-accent': '#60a5fa',
            '--overlay-bg': '#060b16',
            '--overlay-text': '#dbeafe',
        };
        record.animationClass = 'anim-sharp';
        record.layoutPreset = 'cinematic';
        record.soundPack = 'classic';
    } else if (request.themeKey === 'sunset') {
        record.themeVariables = {
            '--overlay-accent': '#fb923c',
            '--overlay-bg': '#1a0f0b',
            '--overlay-text': '#ffedd5',
        };
        record.animationClass = 'anim-soft';
        record.layoutPreset = 'compact';
        record.soundPack = 'pulse';
    } else {
        record.themeVariables = {
            '--overlay-accent': '#22d3ee',
            '--overlay-bg': '#08121f',
            '--overlay-text': '#e2e8f0',
        };
        record.animationClass = 'anim-soft';
        record.layoutPreset = 'balanced';
        record.soundPack = 'pulse';
    }

    record.sequence += 1;

    logInfo('overlay.theme.saved', {
        creatorId: record.creatorId,
        themeKey: record.themeKey,
        updatedAt: record.updatedAt,
    });

    return getOverlayConfigResponse({ creatorId: request.creatorId });
};

export const getOverlayEventsResponse = async (
    payload?: OverlayEventsRequest,
): Promise<OverlayEventsResponse> => {
    const request = payload ?? {
        creatorId: 'creator_default',
        token: '',
        sinceSequence: 0,
    };

    const record = ensureOverlayRecord(request.creatorId);

    const validationResult = validateOverlayToken(record, request.token);
    const isRevoked = record.tokenStatus === 'revoked';

    logInfo('overlay.token.validation', {
        creatorId: record.creatorId,
        publicKey: record.publicKey,
        token: request.token,
        expiresAt: record.tokenExpiresAt,
        revoked: isRevoked,
        scopes: record.scopes,
        result: validationResult,
    });

    if (validationResult !== 'valid') {
        const level = validationResult === 'invalid' ? logWarn : logError;
        level('overlay.runtime.error', {
            creatorId: record.creatorId,
            token: request.token,
            reason: validationResult,
        });
        throw new Error(`Overlay token ${validationResult}`);
    }

    const connectionOpenedAt = new Date().toISOString();
    logInfo('overlay.ws.connection', {
        creatorId: record.creatorId,
        token: request.token,
        ip: request.connectionMeta?.ip ?? 'unknown',
        userAgent: request.connectionMeta?.userAgent ?? 'unknown',
        connectedAt: connectionOpenedAt,
    });

    const sinceSequence = request.sinceSequence ?? 0;
    const nextSequence = record.sequence + 1;

    const events = [
        {
            id: `evt-${nextSequence}`,
            sequence: nextSequence,
            type: 'chat' as const,
            message: 'chat: overlay feed connected',
            createdAt: new Date().toISOString(),
        },
        {
            id: `evt-${nextSequence + 1}`,
            sequence: nextSequence + 1,
            type: 'alert' as const,
            message: 'new follow from creator_fan_42',
            createdAt: new Date().toISOString(),
        },
    ].filter((event) => event.sequence > sinceSequence);

    record.sequence += events.length;

    logInfo('overlay.runtime.connected', {
        creatorId: record.creatorId,
        token: request.token,
        connectedAt: connectionOpenedAt,
    });

    for (const event of events) {
        const payloadSize = JSON.stringify(event).length;
        logInfo('overlay.event.dispatch', {
            creatorId: record.creatorId,
            eventType: event.type,
            payloadSize,
            timestamp: event.createdAt,
            deliveryResult: 'success',
            errorCode: null,
        });
        logInfo('overlay.runtime.event.rendered', {
            creatorId: record.creatorId,
            eventType: event.type,
        });
    }

    logInfo('overlay.ws.disconnection', {
        creatorId: record.creatorId,
        token: request.token,
        disconnectedAt: new Date().toISOString(),
        reason: 'request-completed',
    });

    return {
        channel: record.channel,
        connected: true,
        events,
        nextSequence: record.sequence + 1,
    };
};

export const rotateOverlayTokenResponse = async (
    payload?: OverlayTokenRequest,
): Promise<OverlayTokenResponse> => {
    const request = payload ?? { creatorId: 'creator_default' };
    const record = ensureOverlayRecord(request.creatorId);

    record.token = `ovl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    record.tokenStatus = 'active';
    record.tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString();
    record.updatedAt = new Date().toISOString();

    logInfo('overlay.token.rotated', {
        creatorId: record.creatorId,
        token: record.token,
        expiresAt: record.tokenExpiresAt,
        scopes: record.scopes,
    });

    return {
        creatorId: record.creatorId,
        token: record.token,
        status: record.tokenStatus,
        rotatedAt: record.updatedAt,
    };
};

export const revokeOverlayTokenResponse = async (
    payload?: OverlayTokenRequest,
): Promise<OverlayTokenResponse> => {
    const request = payload ?? { creatorId: 'creator_default' };
    const record = ensureOverlayRecord(request.creatorId);

    record.tokenStatus = 'revoked';
    record.updatedAt = new Date().toISOString();

    logWarn('overlay.token.revoked', {
        creatorId: record.creatorId,
        token: record.token,
        revokedAt: record.updatedAt,
    });

    return {
        creatorId: record.creatorId,
        token: record.token,
        status: 'revoked',
        revokedAt: record.updatedAt,
    };
};
