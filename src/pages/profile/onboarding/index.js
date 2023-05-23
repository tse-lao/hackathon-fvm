import { readJWT } from '@/hooks/useLighthouse'
import lighthouse from '@lighthouse-web3/sdk'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
export default function Index() {
  const { address } = useAccount()
  const [api, setApi] = useState(null)
  const [jwt, setJwt] = useState(null)
  const [reload, setReload] = useState(false)

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

  const setupLighthouse = async () => {
    // 1. Trigger createLighthouse function with user's address.
    const result = await getApiKey(address)

    
    // 2. Create JWT Token with user's address.
    const jwt = await readJWT(address)
    console.log(jwt)
    localStorage.setItem(`lighthouse-jwt-${address}`, jwt)
    
    window.location.reload()
  }

  const getApiKey = async () => {

    const verificationMessage = await fetch(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`
    )
      .then((response) => response.json())
      .then((data) => data);

    const auth = await signAuthMessage(verificationMessage)
    const response = await lighthouse.getApiKey(address, auth)



    localStorage.setItem(`lighthouse-${address}`, response.data.apiKey)

    setApi(response.data.apiKey)
    /* { data: { apiKey: '7d8f3d18.eda91521aa294773a8201d2a7d241a2c' } } */
  }

  const signAuthMessage = async (messageRequested) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signedMessage = await signer.signMessage(messageRequested);
    return (signedMessage)
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
          <ConnectButton />
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-semibold text-gray-700">Lighthouse Credentials</h2>
          <p className="mt-2 text-gray-500">Next, set up your Lighthouse API Key and JWT.</p>
          <div className="space-y-8 mt-4">
            <div>
              <span className="text-gray-700 font-bold mt-4">API Key </span>
              <span className="text-gray-700">{api}</span>
            </div>
            <div>
              <span className="text-gray-700 font-bold mt-4">JWT </span>
              <span className="text-gray-700 overflow-scroll truncate">{jwt}</span>
            </div>
            <button
              onClick={setupLighthouse}
              className="w-full bg-cf-500 hover:bg-cf-700 text-white font-bold py-2 px-4 rounded"
              disabled={address ? false : true}
            >
            Connect to lighthouse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
