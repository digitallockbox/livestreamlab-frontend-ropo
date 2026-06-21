import type {
    AffiliateResponse,
    AnalyticsResponse,
    AutoSplitResponse,
    ContentResponse,
    EarningsResponse,
    IntegrationsResponse,
    OverlayConfigRequest,
    OverlayConfigResponse,
    OverlayEventsRequest,
    OverlayEventsResponse,
    OverlayThemeUpdateRequest,
    OverlayTokenRequest,
    OverlayTokenResponse,
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
    API_ENDPOINTS,
    OVERLAY_ENDPOINTS,
    PHANTOM_ENDPOINTS,
} from '@livestreamlab/shared/constants/endpoints';
import { resolveApiRoute } from '@livestreamlab/backend/server';

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
        fetchJson<AnalyticsResponse>(API_ENDPOINTS.analytics),
    getStreams: (): Promise<StreamsResponse> =>
        fetchJson<StreamsResponse>(API_ENDPOINTS.streams),
    getEarnings: (): Promise<EarningsResponse> =>
        fetchJson<EarningsResponse>(API_ENDPOINTS.earnings),
    getAutoSplitRules: (): Promise<AutoSplitResponse> =>
        fetchJson<AutoSplitResponse>(API_ENDPOINTS.autosplit),
    getContent: (): Promise<ContentResponse> =>
        fetchJson<ContentResponse>(API_ENDPOINTS.content),
    getAffiliate: (): Promise<AffiliateResponse> =>
        fetchJson<AffiliateResponse>(API_ENDPOINTS.affiliate),
    getIntegrations: (): Promise<IntegrationsResponse> =>
        fetchJson<IntegrationsResponse>(API_ENDPOINTS.integrations),
    getSettings: (): Promise<SettingsResponse> =>
        fetchJson<SettingsResponse>(API_ENDPOINTS.settings),
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
    getOverlayConfig: (
        payload: OverlayConfigRequest,
    ): Promise<OverlayConfigResponse> =>
        fetchJson<OverlayConfigResponse>(
            OVERLAY_ENDPOINTS.config,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
    saveOverlayTheme: (
        payload: OverlayThemeUpdateRequest,
    ): Promise<OverlayConfigResponse> =>
        fetchJson<OverlayConfigResponse>(
            OVERLAY_ENDPOINTS.theme,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
    getOverlayEvents: (
        payload: OverlayEventsRequest,
    ): Promise<OverlayEventsResponse> =>
        fetchJson<OverlayEventsResponse>(
            OVERLAY_ENDPOINTS.events,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
    rotateOverlayToken: (
        payload: OverlayTokenRequest,
    ): Promise<OverlayTokenResponse> =>
        fetchJson<OverlayTokenResponse>(
            OVERLAY_ENDPOINTS.rotateToken,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
    revokeOverlayToken: (
        payload: OverlayTokenRequest,
    ): Promise<OverlayTokenResponse> =>
        fetchJson<OverlayTokenResponse>(
            OVERLAY_ENDPOINTS.revokeToken,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(payload),
            },
            payload,
        ),
};
