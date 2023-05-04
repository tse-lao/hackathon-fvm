export type apiKeyResponse = {
    data: {
        apiKey: string;
    };
};
declare const _default: (publicKey: string, signedMessage: string) => Promise<apiKeyResponse>;
export default _default;
