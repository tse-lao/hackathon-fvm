export type shareResponse = {
    data: {
        cid: string;
        shareTo: string | string[];
        status: string;
    };
};
declare const _default: (publicKey: string, shareTo: string[], cid: string, signedMessage: string) => Promise<shareResponse>;
export default _default;
