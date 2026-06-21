import type { PhantomVerifyRequest, PhantomVerifyResponse } from '@livestreamlab/shared/types/DashboardApi';
type WalletSession = {
    userId: string;
    walletAddress: string;
    roles: Array<'creator' | 'viewer' | 'admin'>;
};
export declare const getPhantomVerifyResponse: (payload?: PhantomVerifyRequest) => Promise<PhantomVerifyResponse>;
export declare const resolveWalletSession: (sessionToken: string) => WalletSession | null;
export declare const authRoutes: string[];
export {};
