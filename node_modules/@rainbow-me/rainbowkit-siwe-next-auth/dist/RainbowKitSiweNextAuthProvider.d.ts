import { ReactNode } from 'react';
import { SiweMessage } from 'siwe';
type UnconfigurableMessageOptions = {
    address: string;
    chainId: number;
    nonce: string;
};
type ConfigurableMessageOptions = Partial<Omit<SiweMessage, keyof UnconfigurableMessageOptions>> & {
    [Key in keyof UnconfigurableMessageOptions]?: never;
};
export type GetSiweMessageOptions = () => ConfigurableMessageOptions;
interface RainbowKitSiweNextAuthProviderProps {
    enabled?: boolean;
    getSiweMessageOptions?: GetSiweMessageOptions;
    children: ReactNode;
}
export declare function RainbowKitSiweNextAuthProvider({ children, enabled, getSiweMessageOptions, }: RainbowKitSiweNextAuthProviderProps): JSX.Element;
export {};
