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
import { getAnalyticsResponse } from './routes/analytics.routes';
import { getContentResponse } from './routes/content.routes';
import { getEarningsResponse } from './routes/earnings.routes';
import {
  getIntegrationsResponse,
  getSettingsResponse,
} from './routes/identity.routes';
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
} as const;

type DashboardResponseMap = {
  [DASHBOARD_ENDPOINTS.analytics]: AnalyticsResponse;
  [DASHBOARD_ENDPOINTS.streams]: StreamsResponse;
  [DASHBOARD_ENDPOINTS.earnings]: EarningsResponse;
  [DASHBOARD_ENDPOINTS.autosplit]: AutoSplitResponse;
  [DASHBOARD_ENDPOINTS.content]: ContentResponse;
  [DASHBOARD_ENDPOINTS.affiliate]: AffiliateResponse;
  [DASHBOARD_ENDPOINTS.integrations]: IntegrationsResponse;
  [DASHBOARD_ENDPOINTS.settings]: SettingsResponse;
};

const dashboardResolvers: {
  [Path in keyof DashboardResponseMap]: () => Promise<DashboardResponseMap[Path]>;
} = {
  [DASHBOARD_ENDPOINTS.analytics]: getAnalyticsResponse,
  [DASHBOARD_ENDPOINTS.streams]: getStreamsResponse,
  [DASHBOARD_ENDPOINTS.earnings]: getEarningsResponse,
  [DASHBOARD_ENDPOINTS.autosplit]: getAutoSplitResponse,
  [DASHBOARD_ENDPOINTS.content]: getContentResponse,
  [DASHBOARD_ENDPOINTS.affiliate]: getAffiliateResponse,
  [DASHBOARD_ENDPOINTS.integrations]: getIntegrationsResponse,
  [DASHBOARD_ENDPOINTS.settings]: getSettingsResponse,
};

export const resolveApiRoute = async <T>(path: string): Promise<T> => {
  const resolver = (dashboardResolvers as Record<string, () => Promise<unknown>>)[path];
  if (!resolver) {
    throw new Error(`Unknown API route: ${path}`);
  }

  return (await resolver()) as T;
};

export const startServer = (): string => {
  return `livestreamlab.live backend routes ready (${Object.keys(dashboardResolvers).length} endpoints)`;
};
