export const PLATFORM_DOMAIN = 'livestreamlab.live';
export const PLATFORM_PORT = 8080;

export const PLATFORM_ORIGINS = {
    app: `https://${PLATFORM_DOMAIN}`,
    api: `https://api.${PLATFORM_DOMAIN}:${PLATFORM_PORT}`,
    auth: `https://auth.${PLATFORM_DOMAIN}:${PLATFORM_PORT}`,
    uploads: `https://uploads.${PLATFORM_DOMAIN}:${PLATFORM_PORT}`,
    cdn: `https://cdn.${PLATFORM_DOMAIN}:${PLATFORM_PORT}`,
    ws: `wss://ws.${PLATFORM_DOMAIN}:${PLATFORM_PORT}`,
} as const;

export const API_ENDPOINTS = {
    health: '/health',
    analytics: '/api/analytics',
    streams: '/api/streams',
    earnings: '/api/earnings',
    autosplit: '/api/autosplit',
    content: '/api/content',
    affiliate: '/api/affiliate',
    integrations: '/api/integrations',
    settings: '/api/settings',
} as const;

export const PHANTOM_ENDPOINTS = {
    connect: '/wallet/phantom/connect',
    verify: '/wallet/phantom/verify',
    link: '/wallet/phantom/link',
    checkout: '/wallet/phantom/checkout',
} as const;

export const OVERLAY_ENDPOINTS = {
    config: '/overlay/config',
    theme: '/overlay/theme',
    events: '/overlay/events',
    rotateToken: '/overlay/token/rotate',
    revokeToken: '/overlay/token/revoke',
} as const;

