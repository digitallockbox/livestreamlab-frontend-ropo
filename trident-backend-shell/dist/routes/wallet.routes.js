import { connectPhantom } from '@livestreamlab/core/auth/phantom';
import { resolveWalletSession } from './auth.routes';
export const getPhantomConnectResponse = async (payload) => {
    const request = payload ?? { publicKey: 'phantom_dev_wallet' };
    const challenge = await connectPhantom(request.publicKey);
    return {
        walletAddress: request.publicKey,
        challenge: challenge.challenge,
        nonce: challenge.nonce,
        expiresAt: challenge.expiresAt,
    };
};
export const getPhantomLinkResponse = async (payload) => {
    const request = payload ?? {
        sessionToken: '',
        role: 'creator',
    };
    const session = resolveWalletSession(request.sessionToken);
    if (!session) {
        throw new Error('Invalid Phantom session token');
    }
    return {
        linked: true,
        walletAddress: session.walletAddress,
        role: request.role,
        linkedAt: new Date().toISOString(),
    };
};
export const getPhantomCheckoutResponse = async (payload) => {
    const request = payload ?? {
        sessionToken: '',
        orderId: 'order-dev-001',
        amount: 0,
        currency: 'USDC',
    };
    const session = resolveWalletSession(request.sessionToken);
    if (!session) {
        throw new Error('Invalid Phantom session token');
    }
    const txHash = Math.random().toString(36).slice(2, 12);
    return {
        accepted: true,
        walletAddress: session.walletAddress,
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        transactionSignature: `phantom_tx_${txHash}`,
        receiptId: `receipt_${request.orderId}`,
        confirmedAt: new Date().toISOString(),
    };
};
export const walletRoutes = [
    '/wallet/phantom/connect',
    '/wallet/phantom/link',
    '/wallet/phantom/checkout',
];
