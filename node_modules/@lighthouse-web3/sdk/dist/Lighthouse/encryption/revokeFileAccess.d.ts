export type revokeResponse = {
    data: {
        cid: string;
        revokeTo: string | string[];
        status: string;
    };
};
declare const _default: (publicKey: string, revokeTo: string | string[], cid: string, signedMessage: string) => Promise<revokeResponse>;
export default _default;
