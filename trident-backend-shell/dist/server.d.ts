export declare const DASHBOARD_ENDPOINTS: {
    readonly analytics: "/api/analytics";
    readonly streams: "/api/streams";
    readonly earnings: "/api/earnings";
    readonly autosplit: "/api/autosplit";
    readonly content: "/api/content";
    readonly affiliate: "/api/affiliate";
    readonly integrations: "/api/integrations";
    readonly settings: "/api/settings";
};
export declare const PHANTOM_ENDPOINTS: {
    readonly connect: "/wallet/phantom/connect";
    readonly verify: "/wallet/phantom/verify";
    readonly link: "/wallet/phantom/link";
    readonly checkout: "/wallet/phantom/checkout";
};
export declare const resolveApiRoute: <T>(path: string, payload?: unknown) => Promise<T>;
export declare const startServer: () => string;
