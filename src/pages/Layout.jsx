
import Navigation from '@/components/Navigation'
import { watchAccount } from '@wagmi/core'
import Head from 'next/head'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'


export default function Layout({children, active}) {
  const {address} = useAccount()

  const unwatch = watchAccount((account) => {
    if(account.address != address){
      window.location.reload();
    }
  })
  useEffect(() => {
    const api = localStorage.getItem(`lighthouse-${address}`)
    const jwt = localStorage.getItem(`lighthouse-jwt-${address}`)

    if(address){
      if(!api || !jwt){
        window.location.href = '/profile/onboarding'
      }
    }else {
      window.location.href = '/profile/onboarding'
    }
  }, [address])
  
  
  return (
    <div className="min-h-full">
      <Head>
        <title>DataBridge </title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Bridging your data securely, fast and with full control." />
      </Head>
      <Navigation active={active}/>
        <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 p-12 rounded-md">
          <div >{children}</div>
        </main>
    </div>
  )
}
