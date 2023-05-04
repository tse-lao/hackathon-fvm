// src/wallets/walletConnectors/safeWallet/safeWallet.ts
import { SafeConnector } from "wagmi/connectors/safe";
var safeWallet = ({
  chains,
  ...options
}) => ({
  id: "safe",
  name: "Safe",
  iconAccent: "#12ff80",
  iconBackground: "#fff",
  iconUrl: async () => (await import("./safeWallet-3KUD3U5G.js")).default,
  installed: !(typeof window === "undefined") && (window == null ? void 0 : window.parent) !== window,
  downloadUrls: {},
  createConnector: () => ({
    connector: new SafeConnector({ chains, options })
  })
});

export {
  safeWallet
};
