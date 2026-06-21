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
import { getPhantomVerifyResponse } from './routes/auth.routes';
import { getAnalyticsResponse } from './routes/analytics.routes';
import { getContentResponse } from './routes/content.routes';
import { getEarningsResponse } from './routes/earnings.routes';
import {
  getIntegrationsResponse,
  getSettingsResponse,
} from './routes/identity.routes';
import { getAffiliateResponse, getAutoSplitResponse } from './routes/store.routes';
import { getStreamsResponse } from './routes/stream.routes';
import {
  getPhantomCheckoutResponse,
  getPhantomConnectResponse,
  getPhantomLinkResponse,
} from './routes/wallet.routes';

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

export const PHANTOM_ENDPOINTS = {
  connect: '/wallet/phantom/connect',
  verify: '/wallet/phantom/verify',
  link: '/wallet/phantom/link',
  checkout: '/wallet/phantom/checkout',
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

type PhantomPayloadMap = {
  [PHANTOM_ENDPOINTS.connect]: PhantomConnectRequest;
  [PHANTOM_ENDPOINTS.verify]: PhantomVerifyRequest;
  [PHANTOM_ENDPOINTS.link]: PhantomLinkRequest;
  [PHANTOM_ENDPOINTS.checkout]: PhantomCheckoutRequest;
};

type PhantomResponseMap = {
  [PHANTOM_ENDPOINTS.connect]: PhantomConnectResponse;
  [PHANTOM_ENDPOINTS.verify]: PhantomVerifyResponse;
  [PHANTOM_ENDPOINTS.link]: PhantomLinkResponse;
  [PHANTOM_ENDPOINTS.checkout]: PhantomCheckoutResponse;
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

const phantomResolvers: {
  [Path in keyof PhantomResponseMap]: (
    payload?: PhantomPayloadMap[Path],
  ) => Promise<PhantomResponseMap[Path]>;
} = {
  [PHANTOM_ENDPOINTS.connect]: getPhantomConnectResponse,
  [PHANTOM_ENDPOINTS.verify]: getPhantomVerifyResponse,
  [PHANTOM_ENDPOINTS.link]: getPhantomLinkResponse,
  [PHANTOM_ENDPOINTS.checkout]: getPhantomCheckoutResponse,
};

export const resolveApiRoute = async <T>(path: string, payload?: unknown): Promise<T> => {
  const dashboardResolver = (dashboardResolvers as Record<string, () => Promise<unknown>>)[path];
  if (dashboardResolver) {
    return (await dashboardResolver()) as T;
  }

  const phantomResolver = (
    phantomResolvers as Record<string, (request?: unknown) => Promise<unknown>>
  )[path];

  if (!phantomResolver) {
    throw new Error(`Unknown API route: ${path}`);
  }

  return (await phantomResolver(payload)) as T;
};

export const startServer = (): string => {
  const endpointCount =
    Object.keys(dashboardResolvers).length + Object.keys(phantomResolvers).length;
  return `livestreamlab.live backend routes ready (${endpointCount} endpoints)`;
};
