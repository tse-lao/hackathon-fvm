declare const encryptFile: (fileArrayBuffer: any, password: any) => Promise<Uint8Array>;
declare const decryptFile: (cipher: any, password: any) => Promise<any>;
export { encryptFile, decryptFile };
