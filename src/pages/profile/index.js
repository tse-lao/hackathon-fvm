
import Avatar from "@/components/application/elements/Avatar"

import Tabs from "@/components/application/elements/Tabs"
import ProfileStats from "@/components/application/profile/ProfileStats"
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import Layout from "../Layout"

const stats = [
  { id: 1, name: 'Total Contributions', stat: '71,897', change: '122', changeType: 'increase' },
  { id: 2, name: 'Datasets', stat: '58.16%', change: '5.4%', changeType: 'increase' },
  { id: 3, name: 'Events', stat: '24.57%',  change: '3.2%', changeType: 'decrease' },
]

export default function Profile() {
    const [loading, setLoading] = useState(false)
    const {address} = useAccount();
    
    const tabs = [
      { name: 'API Connections', href: '#', current: true },
      { name: 'Contributions', href: '#', current: false },
      { name: 'DataSets', href: '#', current: false },
      { name: 'Chain Interactions', href: '#', current: false },
    ]

        useEffect(() => {
            setLoading(false)
        }, [])
        
    
    
  return (
    <Layout title="Profile">
    
    <ProfileStats address={address} />
        <div className='bg-white rounded-sm flex items-center py-6 px-12'>
            <Avatar creator={address} height="100" width="100" />
          <div>
            <span className='text-sm text-gray-600 mt-2 uppercase'>Welcome</span>
            <h1 className='text-lg font-bold leading-7 text-gray-700'>{address}</h1>
          </div>      
        </div>
       

        <div className='flex-grow'>
          <Tabs tabs={tabs} />
        </div>
    </Layout>
  )
}

