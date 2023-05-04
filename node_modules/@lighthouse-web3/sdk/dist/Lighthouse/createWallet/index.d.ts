export type createWalletResponse = {
    data: {
        encryptedWallet: string;
    };
};
declare const _default: (password: string) => Promise<createWalletResponse>;
export default _default;
