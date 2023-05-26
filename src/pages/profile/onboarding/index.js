import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import LoginButton from '@/components/application/elements/buttons/LoginButton';
import { OpenButton } from '@/components/application/elements/buttons/OpenButton';
import { useIsMounted } from '@/hooks/useIsMounted';
import { readJWT } from '@/hooks/useLighthouse';
import lighthouse from "@lighthouse-web3/sdk";
import { useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
export default function Index() {

  const [api, setApi] = useState(null)
  const [jwt, setJwt] = useState(null)
  const { address } = useAccount()
  const { data, signMessage, onSuccess } = useSignMessage();
  const mounted = useIsMounted()

  useEffect(() => {
    const apiKey = localStorage.getItem(`lighthouse-${address}`)
    const jwt = localStorage.getItem(`lighthouse-jwt-${address}`)

    if (apiKey) {
      setApi(apiKey)
    }
    if (jwt) {
      setJwt(jwt)
    }

    if (jwt && address && api) {
      window.location.href = '/'
    }
  }, [api, jwt, address])

  useEffect(() => {
    const apiKey = localStorage.getItem(`lighthouse-${address}`)

    if (data && apiKey) {
      storeAPI()
    }
  }, [data])

  const setupLighthouse = async () => {
    // 1. Trigger createLighthouse function with user's address.
    const result = await getApiKey(address)


    // 2. Create JWT Token with user's address.
    const jwt = await readJWT(address)
    console.log(jwt)
    localStorage.setItem(`lighthouse-jwt-${address}`, jwt)
    
    setJwt(jwt)

  }

  const getApiKey = async () => {

    const verificationMessage = await fetch(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`
    )
      .then((response) => response.json())
      .then((data) => data);



    signMessage({ message: verificationMessage })

  }

  async function storeAPI() {
    const response = await lighthouse.getApiKey(address, data)
    localStorage.setItem(`lighthouse-${address}`, response.data.apiKey)
    setApi(response.data.apiKey)
  }

  // The component return a styled layout for the onboarding process.
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5 md:max-w-3xl">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-black">Onboarding</h1>
          <p className="mt-2 text-gray-500">Let's connect your web3 account and setup your Lighthouse credentials.</p>
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-700">Connect Your Web3 Account</h2>
          <p className="mt-2 text-gray-500 mb-4">Click the button below to link your Web3 account.</p>
          <LoginButton />
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-700">Lighthouse Credentials</h2>
          <p className="mt-2 text-gray-500">Next, set up your Lighthouse API Key and JWT.</p>
        
          
          {data ? (
            <div className="space-y-8 mt-4">
            <div>
              <span className="text-gray-700 font-bold mt-4">API Key </span>
              <span className="text-gray-700 m-4">{api}</span>
              <ActionButton onClick={storeAPI} disabled={address ? false : true} text="Get API " />
            </div>
            <div>
              <span className="text-gray-700 font-bold mt-4">JWT </span>
              <span className="text-gray-700 truncate overflow-auto w-full">{jwt}</span>
            </div>
            <button
              onClick={setupLighthouse}
              className="w-full bg-cf-500 hover:bg-cf-700 text-white font-bold py-2 px-4 rounded"
              disabled={address ? false : true}
            >
              Connect to lighthouse
            </button>
          </div>
          ) : (
            <div className="space-y-8 mt-4">
              <OpenButton onClick={getApiKey} text="Create verified message." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
