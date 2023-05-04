// src/RainbowKitSiweNextAuthProvider.tsx
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider
} from "@rainbow-me/rainbowkit";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import React, { useMemo } from "react";
import { SiweMessage } from "siwe";
function RainbowKitSiweNextAuthProvider({
  children,
  enabled,
  getSiweMessageOptions
}) {
  const { status } = useSession();
  const adapter = useMemo(() => createAuthenticationAdapter({
    createMessage: ({ address, chainId, nonce }) => {
      const defaultConfigurableOptions = {
        domain: window.location.host,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1"
      };
      const unconfigurableOptions = {
        address,
        chainId,
        nonce
      };
      return new SiweMessage({
        ...defaultConfigurableOptions,
        ...getSiweMessageOptions == null ? void 0 : getSiweMessageOptions(),
        ...unconfigurableOptions
      });
    },
    getMessageBody: ({ message }) => message.prepareMessage(),
    getNonce: async () => {
      const nonce = await getCsrfToken();
      if (!nonce)
        throw new Error();
      return nonce;
    },
    signOut: async () => {
      await signOut({ redirect: false });
    },
    verify: async ({ message, signature }) => {
      var _a;
      const response = await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature
      });
      return (_a = response == null ? void 0 : response.ok) != null ? _a : false;
    }
  }), [getSiweMessageOptions]);
  return /* @__PURE__ */ React.createElement(RainbowKitAuthenticationProvider, {
    adapter,
    enabled,
    status
  }, children);
}
export {
  RainbowKitSiweNextAuthProvider
};
