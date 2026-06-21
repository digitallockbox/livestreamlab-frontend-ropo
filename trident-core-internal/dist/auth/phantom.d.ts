type PhantomChallenge = {
    challenge: string;
    nonce: string;
    expiresAt: string;
};
export declare const connectPhantom: (publicKey: string) => Promise<PhantomChallenge>;
export declare const verifyPhantomSignature: (publicKey: string, challenge: string, signature: string) => Promise<boolean>;
export {};
