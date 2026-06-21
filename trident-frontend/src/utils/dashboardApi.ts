import type {
    AffiliateResponse,
    AnalyticsResponse,
    AutoSplitResponse,
    ContentResponse,
    EarningsResponse,
    IntegrationsResponse,
    SettingsResponse,
    StreamsResponse,
} from '@livestreamlab/shared/types/DashboardApi';

const API_BASE_URL = 'https://api.livestreamlab.live:8080';

const DASHBOARD_ENDPOINTS = {
    analytics: '/api/analytics',
    streams: '/api/streams',
    earnings: '/api/earnings',
    autosplit: '/api/autosplit',
    content: '/api/content',
    affiliate: '/api/affiliate',
    integrations: '/api/integrations',
    settings: '/api/settings',
} as const;

async function fetchJson<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return (await response.json()) as T;
}

export const dashboardApi = {
    getAnalytics: (): Promise<AnalyticsResponse> =>
        fetchJson<AnalyticsResponse>(DASHBOARD_ENDPOINTS.analytics),
    getStreams: (): Promise<StreamsResponse> =>
        fetchJson<StreamsResponse>(DASHBOARD_ENDPOINTS.streams),
    getEarnings: (): Promise<EarningsResponse> =>
        fetchJson<EarningsResponse>(DASHBOARD_ENDPOINTS.earnings),
    getAutoSplitRules: (): Promise<AutoSplitResponse> =>
        fetchJson<AutoSplitResponse>(DASHBOARD_ENDPOINTS.autosplit),
    getContent: (): Promise<ContentResponse> =>
        fetchJson<ContentResponse>(DASHBOARD_ENDPOINTS.content),
    getAffiliate: (): Promise<AffiliateResponse> =>
        fetchJson<AffiliateResponse>(DASHBOARD_ENDPOINTS.affiliate),
    getIntegrations: (): Promise<IntegrationsResponse> =>
        fetchJson<IntegrationsResponse>(DASHBOARD_ENDPOINTS.integrations),
    getSettings: (): Promise<SettingsResponse> =>
        fetchJson<SettingsResponse>(DASHBOARD_ENDPOINTS.settings),
};
