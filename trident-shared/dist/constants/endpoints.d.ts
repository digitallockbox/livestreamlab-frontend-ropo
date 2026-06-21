export declare const PLATFORM_DOMAIN = "livestreamlab.live";
export declare const PLATFORM_PORT = 8080;
export declare const PLATFORM_ORIGINS: {
    readonly app: "https://livestreamlab.live";
    readonly api: "https://api.livestreamlab.live:8080";
    readonly auth: "https://auth.livestreamlab.live:8080";
    readonly uploads: "https://uploads.livestreamlab.live:8080";
    readonly cdn: "https://cdn.livestreamlab.live:8080";
    readonly ws: "wss://ws.livestreamlab.live:8080";
};
export declare const API_ENDPOINTS: {
    readonly health: "/health";
    readonly analytics: "/api/analytics";
    readonly streams: "/api/streams";
    readonly earnings: "/api/earnings";
    readonly autosplit: "/api/autosplit";
    readonly content: "/api/content";
    readonly affiliate: "/api/affiliate";
    readonly integrations: "/api/integrations";
    readonly settings: "/api/settings";
};
