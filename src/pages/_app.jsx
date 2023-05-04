import '@/styles/tailwind.css';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { SessionProvider } from 'next-auth/react';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { mainnet, optimism, polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from "wagmi/providers/public";



export default function App({ Component, pageProps }) {
  const { chains, provider } = configureChains(
    [mainnet, polygon, optimism, polygonMumbai],

      [publicProvider()]
    
  );
  const { connectors } = getDefaultWallets({
    appName: 'DataHack',
    projectId: 'YOUR_PROJECT_ID',
    chains
  });
  
  
  const client = createClient({
    autoConnect: true,
    connectors,
    provider,
  })
  
  

  
  return (
  <WagmiConfig client={client}>
      <SessionProvider refetchInterval={0} session={pageProps.session}>
        <RainbowKitSiweNextAuthProvider>
          <RainbowKitProvider chains={chains} >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </RainbowKitSiweNextAuthProvider>
      </SessionProvider>
    </WagmiConfig>
   )
}
