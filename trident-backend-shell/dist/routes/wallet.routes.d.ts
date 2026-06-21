import type { PhantomCheckoutRequest, PhantomCheckoutResponse, PhantomConnectRequest, PhantomConnectResponse, PhantomLinkRequest, PhantomLinkResponse } from '@livestreamlab/shared/types/DashboardApi';
export declare const getPhantomConnectResponse: (payload?: PhantomConnectRequest) => Promise<PhantomConnectResponse>;
export declare const getPhantomLinkResponse: (payload?: PhantomLinkRequest) => Promise<PhantomLinkResponse>;
export declare const getPhantomCheckoutResponse: (payload?: PhantomCheckoutRequest) => Promise<PhantomCheckoutResponse>;
export declare const walletRoutes: string[];
