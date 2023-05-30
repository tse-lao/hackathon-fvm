
import Navigation from '@/components/Navigation'
import Head from 'next/head'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'



export default function Layout({ children, active }) {
  const { address, isDisconnected, isConnecting, status, isConnected} = useAccount()


  useEffect(() => {
    

    const wagmiConnected = localStorage.getItem('wagmi.connected');
    const isWagmiConnected = wagmiConnected ? JSON.parse(wagmiConnected) : false;
    
    ///
    console.log("displaying all the statusses to see which is the right one")
    console.log("status")
    console.log(status)
    console.log("isConnected")
    console.log(isConnected)
    console.log("isConnecting")
    console.log(isConnecting)
    console.log("isDisconnected")
    console.log(isDisconnected)
    console.log("end of statusses")

    
    if(!isConnected && status == 'disconnected' ){
      console.log("@@@@@  user is disconnected please connect")
    }
    

      if(address) {
        const api = localStorage.getItem(`lighthouse-${address}`)
        const jwt = localStorage.getItem(`lighthouse-jwt-${address}`)
  
  
        if (!api || !jwt){
       //   window.location.href = '/profile/onboarding'
        }
      }

      console.log(isWagmiConnected)
      
     


  }, [isConnected])


  return (
    <div className="min-h-full">
      <Head>
        <title>DataBridge </title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Bridging your data securely, fast and with full control." />
      </Head>
      <Navigation active={active} />
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 p-12 rounded-md">
        <div >{children}</div>
      </main>
    </div>
  )
}
