import { getLighthouse } from '@/lib/createLighthouseApi';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from "ethers";
import { useEffect, useState } from "react";
export default function CreateSpace({ address }) {
  const [api, setApi] = useState(null)


  const signAuthMessage = async (messageRequested) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signedMessage = await signer.signMessage(messageRequested);
    return (signedMessage)
  }
  
  useEffect(() => {
    const checkAPI = async () => {
        const response = await getLighthouse()
        console.log(response)
        if(!response){
         return; 
        }
        setApi(response)
    }
    checkAPI()
        
  }, [])

  const getApiKey = async () => {

    const verificationMessage = await fetch(
      `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`
    )
      .then((response) => response.json())
      .then((data) => data);

    const signedMessage = await signAuthMessage(verificationMessage)

    const response = await lighthouse.getApiKey(address, signedMessage)
    console.log(response)

    setApi(response.data.apiKey)
    
    localStorage.setItem(`lighthouse-${address}`, response.data.apiKey)

    /* { data: { apiKey: '7d8f3d18.eda91521aa294773a8201d2a7d241a2c' } } */
  }




  return (
    <div className="p-6 flex flex-col">
      <h3 className="text-lg font-semibold mb-4">API Key</h3>
      <input
        type="text"
        className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 mb-4"
        readOnly
        value={api}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        onClick={getApiKey}
        disabled={api !== null}
      >
        Generate API Key
      </button>
    </div>
  )
}
