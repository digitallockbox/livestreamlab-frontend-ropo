const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
export const connectPhantom = async (publicKey) => {
    const now = Date.now();
    const nonce = `nonce-${publicKey.slice(0, 6)}-${now}`;
    const challenge = `Sign in to livestreamlab.live\nWallet:${publicKey}\nNonce:${nonce}`;
    return {
        challenge,
        nonce,
        expiresAt: new Date(now + ACTIVE_WINDOW_MS).toISOString(),
    };
};
export const verifyPhantomSignature = async (publicKey, challenge, signature) => {
    const expected = `signed:${challenge}`;
    const fallback = `signed:${publicKey}`;
    return signature === expected || signature === fallback;
};
