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
import { polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const auth = typeof window !== 'undefined' ? new Auth() : null;
const db = new Polybase({
  defaultNamespace: process.env.POLYBASE || "pk/0xd89cd07b2a59a0059a9001225dc6f2e27c207cc2e8df89c9f4dfcb1673f1c25b201619d55d529a0c016ea157b79abbfd26b9e57405a1de29682df4c215e32dd2/HACK"
});

const litProtocol = {
  id: 175177,
  name: 'Chronicle - Lit Protocol Testnet',
  network: 'chronicle',
  iconUrl: 'https://example.com/icon.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'LIT',
    symbol: 'LIT',
  },
  rpcUrls: {
    default: {
      http: ['https://chain-rpc.litprotocol.com/http'],
    },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://chain.litprotocol.com/' },
    litprotocl: { name: 'SnowTrace', url: 'https://chain.litprotocol.com/' },
  },
  testnet: false,
};

const hyperspace = {
  id: 3141,
  name: 'HyperSpace ',
  network: 'hyperspace',
  iconUrl: 'https://example.com/icon.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'FIL',
    symbol: 'Fil',
  },
  rpcUrls: {
    default: {
      http: ['https://api.hyperspace.node.glif.io/rpc/v1'],
    },
  },
  blockExplorers: {
    default: { name: 'Filfox', url: 'https://hyperspace.filfox.info/en' },
    litprotocl: { name: 'SnowTrace', url: 'https://chain.litprotocol.com/' },
  },
  testnet: false,
};



const { chains, provider } = configureChains(
  [polygon, polygonMumbai, litProtocol, hyperspace],
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
          <ToastContainer />
        </RainbowKitProvider>
      </WagmiConfig>
    </AuthProvider>
    </PolybaseProvider>
  )
}
