import '@/styles/tailwind.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, polygonMumbai, polygonZkEvm } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { Auth } from '@polybase/auth';
import { Polybase } from "@polybase/client";
import { AuthProvider, PolybaseProvider } from "@polybase/react";

const db = new Polybase({
  defaultNamespace: "pk/0xd89cd07b2a59a0059a9001225dc6f2e27c207cc2e8df89c9f4dfcb1673f1c25b201619d55d529a0c016ea157b79abbfd26b9e57405a1de29682df4c215e32dd2/HACKdataverse",
});

const auth = typeof window !== 'undefined' ? new Auth() : null;




const { chains, provider } = configureChains(
  [mainnet, polygon, polygonMumbai, polygonZkEvm],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function App({ Component, pageProps }) {
  return (
    <PolybaseProvider polybase={db}>
    <AuthProvider auth={auth} polybase={db}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </AuthProvider>
    </PolybaseProvider>
  )
}
