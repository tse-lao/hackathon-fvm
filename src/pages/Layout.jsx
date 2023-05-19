
import Navigation from '@/components/Navigation'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'


export default function Layout({children, active}) {
  const {address} = useAccount()
  const mounted = useIsMounted()

  useEffect(() => {
    const api = localStorage.getItem(`lighthouse-${address}`)
    const jwt = localStorage.getItem(`lighthouse-jwt-${address}`)

    if(address){
      if(!api || !jwt){
        window.location.href = '/onboarding'
      }
    }
  }, [address, mounted])
  return (
    <>
      <div className="min-h-full">

      <Navigation active={active}/>
        <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 p-12 rounded-md">
          <div >{children}</div>
        </main>
      </div>
    </>
  )
}
