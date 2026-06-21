import { getPhantomVerifyResponse } from './routes/auth.routes';
import { getAnalyticsResponse } from './routes/analytics.routes';
import { getContentResponse } from './routes/content.routes';
import { getEarningsResponse } from './routes/earnings.routes';
import { getIntegrationsResponse, getSettingsResponse, } from './routes/identity.routes';
import { getAffiliateResponse, getAutoSplitResponse } from './routes/store.routes';
import { getStreamsResponse } from './routes/stream.routes';
import { getPhantomCheckoutResponse, getPhantomConnectResponse, getPhantomLinkResponse, } from './routes/wallet.routes';
export const DASHBOARD_ENDPOINTS = {
    analytics: '/api/analytics',
    streams: '/api/streams',
    earnings: '/api/earnings',
    autosplit: '/api/autosplit',
    content: '/api/content',
    affiliate: '/api/affiliate',
    integrations: '/api/integrations',
    settings: '/api/settings',
};
export const PHANTOM_ENDPOINTS = {
    connect: '/wallet/phantom/connect',
    verify: '/wallet/phantom/verify',
    link: '/wallet/phantom/link',
    checkout: '/wallet/phantom/checkout',
};
const dashboardResolvers = {
    [DASHBOARD_ENDPOINTS.analytics]: getAnalyticsResponse,
    [DASHBOARD_ENDPOINTS.streams]: getStreamsResponse,
    [DASHBOARD_ENDPOINTS.earnings]: getEarningsResponse,
    [DASHBOARD_ENDPOINTS.autosplit]: getAutoSplitResponse,
    [DASHBOARD_ENDPOINTS.content]: getContentResponse,
    [DASHBOARD_ENDPOINTS.affiliate]: getAffiliateResponse,
    [DASHBOARD_ENDPOINTS.integrations]: getIntegrationsResponse,
    [DASHBOARD_ENDPOINTS.settings]: getSettingsResponse,
};
const phantomResolvers = {
    [PHANTOM_ENDPOINTS.connect]: getPhantomConnectResponse,
    [PHANTOM_ENDPOINTS.verify]: getPhantomVerifyResponse,
    [PHANTOM_ENDPOINTS.link]: getPhantomLinkResponse,
    [PHANTOM_ENDPOINTS.checkout]: getPhantomCheckoutResponse,
};
export const resolveApiRoute = async (path, payload) => {
    const dashboardResolver = dashboardResolvers[path];
    if (dashboardResolver) {
        return (await dashboardResolver());
    }
    const phantomResolver = phantomResolvers[path];
    if (!phantomResolver) {
        throw new Error(`Unknown API route: ${path}`);
    }
    return (await phantomResolver(payload));
};
export const startServer = () => {
    const endpointCount = Object.keys(dashboardResolvers).length + Object.keys(phantomResolvers).length;
    return `livestreamlab.live backend routes ready (${endpointCount} endpoints)`;
};
