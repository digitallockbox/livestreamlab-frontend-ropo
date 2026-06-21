import type {
    AffiliateResponse,
    AnalyticsResponse,
    AutoSplitResponse,
    ContentResponse,
    EarningsResponse,
    IntegrationsResponse,
    PhantomCheckoutRequest,
    PhantomCheckoutResponse,
    PhantomConnectRequest,
    PhantomConnectResponse,
    PhantomLinkRequest,
    PhantomLinkResponse,
    PhantomVerifyRequest,
    PhantomVerifyResponse,
    SettingsResponse,
    StreamsResponse,
} from '@livestreamlab/shared/types/DashboardApi';
import {
    DASHBOARD_ENDPOINTS,
    PHANTOM_ENDPOINTS,
    resolveApiRoute,
} from '@livestreamlab/backend/server';

const API_BASE_URL = 'https://api.livestreamlab.live:8080';

async function fetchJson<T>(path: string, requestInit?: RequestInit, payload?: unknown): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${path}`, requestInit);
        if (response.ok) {
            return (await response.json()) as T;
        }
    } catch {
        // Fall through to in-workspace resolver used by local previews.
    }

    return resolveApiRoute<T>(path, payload);
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
    phantomConnect: (
        payload: PhantomConnectRequest,
    ): Promise<PhantomConnectResponse> =>
        fetchJson<PhantomConnectResponse>(
            PHANTOM_ENDPOINTS.connect,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
    phantomVerify: (payload: PhantomVerifyRequest): Promise<PhantomVerifyResponse> =>
        fetchJson<PhantomVerifyResponse>(
            PHANTOM_ENDPOINTS.verify,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
    phantomLink: (payload: PhantomLinkRequest): Promise<PhantomLinkResponse> =>
        fetchJson<PhantomLinkResponse>(
            PHANTOM_ENDPOINTS.link,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
    phantomCheckout: (
        payload: PhantomCheckoutRequest,
    ): Promise<PhantomCheckoutResponse> =>
        fetchJson<PhantomCheckoutResponse>(
            PHANTOM_ENDPOINTS.checkout,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
};
