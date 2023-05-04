import {
  isIOS
} from "./chunk-FJVNKOUD.js";
import {
  getWalletConnectConnector
} from "./chunk-XRTMZ3WL.js";

// src/wallets/walletConnectors/walletConnectWallet/walletConnectWallet.ts
var walletConnectWallet = ({
  chains,
  options,
  projectId
}) => ({
  id: "walletConnect",
  name: "WalletConnect",
  iconUrl: async () => (await import("./walletConnectWallet-GTSESN7Q.js")).default,
  iconBackground: "#3b99fc",
  createConnector: () => {
    const ios = isIOS();
    const connector = getWalletConnectConnector({
      version: "1",
      chains,
      options: {
        qrcode: ios,
        projectId,
        ...options
      }
    });
    const getUri = async () => (await connector.getProvider()).connector.uri;
    return {
      connector,
      ...ios ? {} : {
        mobile: { getUri },
        qrCode: { getUri }
      }
    };
  }
});

export {
  walletConnectWallet
};
