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
  API_ENDPOINTS,
  PHANTOM_ENDPOINTS,
} from '@livestreamlab/shared/constants/endpoints';
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
import {
  getOverlayConfigResponse,
  getOverlayEventsResponse,
  type OverlayConfigRequest,
  type OverlayConfigResponse,
  type OverlayEventsRequest,
  type OverlayEventsResponse,
  type OverlayThemeUpdateRequest,
  type OverlayTokenRequest,
  type OverlayTokenResponse,
  revokeOverlayTokenResponse,
  rotateOverlayTokenResponse,
  saveOverlayThemeResponse,
} from './routes/overlay.routes';

const OVERLAY_ENDPOINTS = {
  config: '/overlay/config',
  theme: '/overlay/theme',
  events: '/overlay/events',
  rotateToken: '/overlay/token/rotate',
  revokeToken: '/overlay/token/revoke',
} as const;

export const DASHBOARD_ENDPOINTS = API_ENDPOINTS;

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

type OverlayPayloadMap = {
  [OVERLAY_ENDPOINTS.config]: OverlayConfigRequest;
  [OVERLAY_ENDPOINTS.theme]: OverlayThemeUpdateRequest;
  [OVERLAY_ENDPOINTS.events]: OverlayEventsRequest;
  [OVERLAY_ENDPOINTS.rotateToken]: OverlayTokenRequest;
  [OVERLAY_ENDPOINTS.revokeToken]: OverlayTokenRequest;
};

type OverlayResponseMap = {
  [OVERLAY_ENDPOINTS.config]: OverlayConfigResponse;
  [OVERLAY_ENDPOINTS.theme]: OverlayConfigResponse;
  [OVERLAY_ENDPOINTS.events]: OverlayEventsResponse;
  [OVERLAY_ENDPOINTS.rotateToken]: OverlayTokenResponse;
  [OVERLAY_ENDPOINTS.revokeToken]: OverlayTokenResponse;
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

const overlayResolvers: {
  [Path in keyof OverlayResponseMap]: (
    payload?: OverlayPayloadMap[Path],
  ) => Promise<OverlayResponseMap[Path]>;
} = {
  [OVERLAY_ENDPOINTS.config]: getOverlayConfigResponse,
  [OVERLAY_ENDPOINTS.theme]: saveOverlayThemeResponse,
  [OVERLAY_ENDPOINTS.events]: getOverlayEventsResponse,
  [OVERLAY_ENDPOINTS.rotateToken]: rotateOverlayTokenResponse,
  [OVERLAY_ENDPOINTS.revokeToken]: revokeOverlayTokenResponse,
};

export const resolveApiRoute = async <T>(path: string, payload?: unknown): Promise<T> => {
  const dashboardResolver = (dashboardResolvers as Record<string, () => Promise<unknown>>)[path];
  if (dashboardResolver) {
    return (await dashboardResolver()) as T;
  }

  const phantomResolver = (
    phantomResolvers as Record<string, (request?: unknown) => Promise<unknown>>
  )[path];

  if (phantomResolver) {
    return (await phantomResolver(payload)) as T;
  }

  const overlayResolver = (
    overlayResolvers as Record<string, (request?: unknown) => Promise<unknown>>
  )[path];

  if (overlayResolver) {
    return (await overlayResolver(payload)) as T;
  }

  throw new Error(`Unknown API route: ${path}`);
};

export const startServer = (): string => {
  const endpointCount =
    Object.keys(dashboardResolvers).length +
    Object.keys(phantomResolvers).length +
    Object.keys(overlayResolvers).length;
  return `livestreamlab.live backend routes ready (${endpointCount} endpoints)`;
};
