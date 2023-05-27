import { ActionButton } from '@/components/application/elements/buttons/ActionButton'
import { useContract } from '@/hooks/useContract'
import Layout from '@/pages/Layout'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Faucet() {
    const [address, setAddress] = useState("")
    const {fundEscrowMumbai, fundUserHyperspace} = useContract()

    async function getTokens() {
        
        
        toast.promise(fundEscrowMumbai(address), {
            pending: 'Funding Mumbai...',
            success: `${address} succesfully funded!`,
            error: 'Error sending tokens',
        })
        
        toast.promise(fundUserHyperspace(address), {
            pending: 'Funding hyperspace...',
            success: `${address} succesfully funded!`,
            error: 'Error sending tokens',
        })

        
    }
    
    
    
    
    
    
  return (
        <Layout>
        <div className='flex flex-col gap-12 max-w-[600px] justify-center  content-center text-gray-600'>
        <h1 className='text-xl font-bold'>Free Tokens</h1>
        <span>
            In order to use the application you need to have tokens, these tokens will be used for registering your actions like creating new records. 
            Our application is fully decentralized and running on blockchain technology. 
            This means that you need to have tokens to be able to use the application.
            </span>
            <span>
            You can get free tokens by clicking the button below.
        </span>
        <span>
            We are only able to give a small amount of tokens per day, so please be patient if you don't receive tokens immediately.
            Also if you already own enough tokens to fulfill are actions you don't need to get more tokens.
        </span>
            <input className='border border-gray-300 rounded-md p-2' value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Enter your address' />        
        <ActionButton text="Send Tokens" onClick={getTokens}/>
        </div>
        

            
            
        </Layout>
  )
}
