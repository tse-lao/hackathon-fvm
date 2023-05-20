import Avatar from '@/components/application/elements/Avatar'
import Tabs from '@/components/application/elements/Tabs'
import Contributions from '@/components/application/profile/Contributions'
import ProfileDataSets from '@/components/application/profile/ProfileDataSets'
import ProfileStats from '@/components/application/profile/ProfileStats'
import Layout from '@/pages/Layout'
import { useRouter } from 'next/router'
import { useState } from 'react'
const tabs = [
  { name: 'Contributions', href: '#', current: true },
  { name: 'DataSets', href: '#', current: false },
  { name: 'Transactions', href: '#', current: false },
]

const stats = [
  { id: 1, name: 'Total Contributions', stat: '71,897', change: '122', changeType: 'increase' },
  { id: 2, name: 'Datasets', stat: '58.16%', change: '5.4%', changeType: 'increase' },
  { id: 3, name: 'Events', stat: '24.57%',  change: '3.2%', changeType: 'decrease' },
]

export default function Profile() {
    const router = useRouter()
    const {id} = router.query
    const [select, setSelect] = useState("Contributions")
    
    const setSelected = (tab) => {
        setSelect(tab)
    }
    
  return (
    <Layout title="Profile">
    
      <ProfileStats address={id} />
        <div className='bg-white rounded-sm flex items-center py-6 px-12 mt-6'>
            <Avatar creator={id} height="100" width="100" />
            <div>
            <span className='text-sm text-gray-600 mt-2 uppercase'>You are viewing</span>
            <h1 className='text-lg font-bold leading-7 text-gray-700'>{id}</h1>
            </div>
            
        </div>
        <Tabs tabs={tabs} selected={setSelected} active={select} />
        <div className='flex mt-12'>
          {select === "Contributions" && <Contributions creator={id} />}
          {select === "DataSets" && <ProfileDataSets creator={id} />}
        </div>
    </Layout>
  )
}

