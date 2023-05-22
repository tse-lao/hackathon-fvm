
import Navigation from '@/components/Navigation'
import Head from 'next/head'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'


export default function Layout({children, active}) {
  const {address} = useAccount()

  useEffect(() => {
    const api = localStorage.getItem(`lighthouse-${address}`)
    const jwt = localStorage.getItem(`lighthouse-jwt-${address}`)

    if(address){
      if(!api || !jwt){
        window.location.href = '/profile/onboarding'
      }
    }
  }, [address])
  return (
    <div className="min-h-full">
      <Head>
        <title>Connect Fast - {active}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Connect Fast, collect and store your private data in a secure way!" />
      </Head>
      <Navigation active={active}/>
        <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 p-12 rounded-md">
          <div >{children}</div>
        </main>
    </div>
  )
}
