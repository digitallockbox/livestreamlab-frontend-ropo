import { signJwt } from '@livestreamlab/core/auth/jwt';
import { verifyPhantomSignature } from '@livestreamlab/core/auth/phantom';
const walletSessions = new Map();
export const getPhantomVerifyResponse = async (payload) => {
    const request = payload ?? {
        publicKey: 'phantom_dev_wallet',
        signature: 'signed:phantom_dev_wallet',
        challenge: 'phantom_dev_wallet',
    };
    const verified = await verifyPhantomSignature(request.publicKey, request.challenge, request.signature);
    if (!verified) {
        throw new Error('Phantom signature verification failed');
    }
    const userId = `creator_${request.publicKey.slice(0, 6)}`;
    const sessionToken = signJwt({
        sub: userId,
        walletAddress: request.publicKey,
        iat: Date.now(),
    });
    const roles = ['creator'];
    walletSessions.set(sessionToken, {
        userId,
        walletAddress: request.publicKey,
        roles,
    });
    return {
        verified,
        sessionToken,
        userId,
        walletAddress: request.publicKey,
        roles,
    };
};
export const resolveWalletSession = (sessionToken) => {
    return walletSessions.get(sessionToken) ?? null;
};
export const authRoutes = ['/wallet/phantom/verify'];
