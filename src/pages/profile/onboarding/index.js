import { readJWT } from '@/hooks/useLighthouse'
import lighthouse from '@lighthouse-web3/sdk'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
export default function Index() {
  const {address} = useAccount()
  const [api, setApi] = useState(null)
  const [jwt, setJwt] = useState(null)
  const [reload, setReload] = useState(false)
  
  useEffect(() => {
      const apiKey = localStorage.getItem(`lighthouse-${address}`)
      const jwt = localStorage.getItem(`lighthouse-jwt-${address}`)
      
      if(apiKey){
        setApi(apiKey)
      }
      if(jwt){
        setJwt(jwt)
      }
      
      if(jwt && address && api){
        window.location.href = '/'
      }
  }, [api, jwt, address])

  const setupLighthouse = async () => {
    // 1. Trigger createLighthouse function with user's address.
    const result = await getApiKey(address)
    console.log(result)

    // 2. Create JWT Token with user's address.
    const jwt = await readJWT(address)
    console.log(jwt)
    localStorage.setItem(`lighthouse-jwt-${address}`, jwt)
  }
  
  const getApiKey = async () => {

    const verificationMessage = await fetch(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`
    )
      .then((response) => response.json())
      .then((data) => data);

    const auth= await signAuthMessage(verificationMessage)
console.log(auth)
    const response = await lighthouse.getApiKey(address, auth)
    console.log(response)

    
    localStorage.setItem(`lighthouse-${address}`, response.data.apiKey)

    setApi(response.data.apiKey)
    setJwt(jwt)
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
    <div className="container mx-auto px-4 py-8 bg-gray-100 h-screen">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Onboarding</h1>
            <p className="mt-2 text-gray-500">Connect your web3 account</p>
            
            {/* 3. User clicks ConnectButton to link their Web3 account */}
            <div className="mt-4">
              <ConnectButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"/>
            </div>
            
            <p className="mt-6 text-gray-500">Please create your lighthouse credentials</p>

            {/* 4. User clicks button to setup Lighthouse credentials */}
            <div className="mt-4">
              <div>
              <span className="text-gray-700">API Key:</span>
              <span className="text-gray-700">{api}</span>
                
              </div>
              <div>
              <span className="text-gray-700">JWT:</span>
              <span className="text-gray-700">{jwt}</span>
                
              </div>
              <button
                onClick={setupLighthouse}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Connect to Lighthouse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
