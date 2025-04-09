export declare function generateRSAKeys(): Promise<{
    publicKey: string;
    privateKey: string;
}>;
export declare function generateECCKeys(): Promise<{
    publicKey: string;
    privateKey: string;
}>;
export declare function exportPublicKey(key: CryptoKey): Promise<string>;
export declare function exportPrivateKey(key: CryptoKey): Promise<string>;
export declare function downloadPrivateKey(key: CryptoKey, filename: string): Promise<void>;
