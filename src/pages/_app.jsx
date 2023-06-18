import { calibration } from '@/lib/chains/calibration';
import { Auth } from '@polybase/auth';
import { Polybase } from "@polybase/client";
import { AuthProvider, PolybaseProvider } from "@polybase/react";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { arbitrum, filecoinHyperspace, polygon, polygonMumbai } from "wagmi/chains";
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';
import '../styles/tailwind.css';

import { Web3Auth } from "@web3auth/modal";
import { AddressWrapper } from '../hooks/AddressWrapper';

const auth = typeof window !== 'undefined' ? new Auth() : null;
const db = new Polybase({
  defaultNamespace: process.env.POLYBASE || "pk/0xd89cd07b2a59a0059a9001225dc6f2e27c207cc2e8df89c9f4dfcb1673f1c25b201619d55d529a0c016ea157b79abbfd26b9e57405a1de29682df4c215e32dd2/HACK"
});

// Configure chains & providers with the Public provider.
const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai, arbitrum, polygon, filecoinHyperspace, calibration],
  [publicProvider()],
)

const web3AuthInstance = typeof window !== 'undefined' ? new Web3Auth({
  clientId: "BDlUlpSomDUSEzG9ZfwlbTUuhSnNPHqQuciI7suaSc4xMwQV_B3xHwXEFmDml2Rh96GnXuNFw4pfQ5CPX6B0A7o",
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: "eip155",
    chainId: "0x13881", 
    rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
    displayName: "Polygon Mumbai Testnet",
    blockExplorer: "https://mumbai.polygonscan.com/",
    ticker: "MATIC",
    tickerName: "Matic",
  },
}) : null;


// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new Web3AuthConnector({
      chains,
      options: {
        web3AuthInstance,
        name: "Google", 
        shimDisconnect: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Browser',
        shimDisconnect: true,
      },
    }),

  ],
  provider,
  webSocketProvider,
})







export default function App({ Component, pageProps }) {
  return (
    <PolybaseProvider polybase={db}>
      <AuthProvider auth={auth} polybase={db}>
        <WagmiConfig client={client}>
          <AddressWrapper>
            <Component {...pageProps} />
            <ToastContainer
              position="bottom-center"
            />
          </AddressWrapper>
        </WagmiConfig>

      </AuthProvider>
    </PolybaseProvider>

  )
}
