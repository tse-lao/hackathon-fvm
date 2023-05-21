import '@/styles/tailwind.css';
import { Auth } from '@polybase/auth';
import { Polybase } from "@polybase/client";
import { AuthProvider, PolybaseProvider } from "@polybase/react";
import {
  RainbowKitProvider,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { filecoinHyperspace, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const auth = typeof window !== 'undefined' ? new Auth() : null;
const db = new Polybase({
  defaultNamespace: process.env.POLYBASE || "pk/0xd89cd07b2a59a0059a9001225dc6f2e27c207cc2e8df89c9f4dfcb1673f1c25b201619d55d529a0c016ea157b79abbfd26b9e57405a1de29682df4c215e32dd2/HACK"
});



const { chains, provider } = configureChains(
  [polygonMumbai, filecoinHyperspace],
  [
    publicProvider()
  ], 
  { batch: { multicall: true } },

  
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: process.env.RAINBOW,
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
          <ToastContainer 
          position="bottom-center"

          />
        </RainbowKitProvider>
      </WagmiConfig>
    </AuthProvider>
    </PolybaseProvider>
  )
}
