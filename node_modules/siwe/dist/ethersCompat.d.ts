import { utils } from 'ethers';
declare type Ethers6BigNumberish = string | number | bigint;
declare type Ethers6SignatureLike = string | {
    r: string;
    s: string;
    v: Ethers6BigNumberish;
    yParity?: 0 | 1;
    yParityAndS?: string;
} | {
    r: string;
    yParityAndS: string;
    yParity?: 0 | 1;
    s?: string;
    v?: number;
} | {
    r: string;
    s: string;
    yParity: 0 | 1;
    v?: Ethers6BigNumberish;
    yParityAndS?: string;
};
export declare const verifyMessage: typeof utils.verifyMessage | ((message: Uint8Array | string, sig: Ethers6SignatureLike) => string);
export declare const hashMessage: typeof utils.hashMessage;
export declare const getAddress: typeof utils.getAddress;
export {};
