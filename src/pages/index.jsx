import Tabs from '@/components/application/elements/Tabs'
import LoadingFull from '@/components/application/elements/loading/LoadingFull'
import Drive from '@/components/application/files/organised/Drive'
import Contributions from '@/components/application/profile/Contributions'
import ProfileDataSets from '@/components/application/profile/ProfileDataSets'
import ProfileStats from '@/components/application/profile/ProfileStats'
import Recommendations from '@/components/application/profile/Recommendations'
import Repository from '@/components/application/profile/Repository'
import { useIsMounted } from '@/hooks/useIsMounted'
import Layout from '@/pages/Layout'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
const tabs = [
  { name: 'Contributions', href: '#', current: true },
  { name: 'DataSets', href: '#', current: false },
  { name: 'Recommendation', href: '#', current: false },
  { name: 'Files', href: '#', current: false },
  { name: 'Groups', href: '#', current: false },
]



export default function Profile() {
  const { address, isConnected, status } = useAccount()
  const [select, setSelect] = useState("Contributions")
  const [loading, setLoading] = useState(true)
  const mounted = useIsMounted()
  

  
  useEffect(() => {
    if (mounted) {
      setLoading(false)
    }
    
  }, [])


  const setSelected = (tab) => {
    setSelect(tab)
  }



  if(isConnected) { 
  return (
    <Layout active="Dashboard">
      <ProfileStats address={address} />

      <div className='mt-12'>
        <Tabs tabs={tabs} selected={setSelected} active={select} />
        <div className='mt-12'>
          {select === "Contributions" && <Contributions creator={address} />}
          {select === "DataSets" && <ProfileDataSets creator={address} />}
          {select === "Recommendation" && <Recommendations address={address} />}
          {select === "Files" && <Drive address={address} />}
          {select === "Groups" && <Repository adress={address} />}
        </div>
      </div>
    
    </Layout>
  )
  }

    return <LoadingFull />
  
  }


    

