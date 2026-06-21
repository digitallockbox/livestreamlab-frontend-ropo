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
} as const;

