import { getAnalyticsResponse } from './routes/analytics.routes';
import { getContentResponse } from './routes/content.routes';
import { getEarningsResponse } from './routes/earnings.routes';
import { getIntegrationsResponse, getSettingsResponse, } from './routes/identity.routes';
import { getAffiliateResponse, getAutoSplitResponse } from './routes/store.routes';
import { getStreamsResponse } from './routes/stream.routes';
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
export const resolveApiRoute = async (path) => {
    const resolver = dashboardResolvers[path];
    if (!resolver) {
        throw new Error(`Unknown API route: ${path}`);
    }
    return (await resolver());
};
export const startServer = () => {
    return `livestreamlab.live backend routes ready (${Object.keys(dashboardResolvers).length} endpoints)`;
};
