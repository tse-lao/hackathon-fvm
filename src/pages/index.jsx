import Tabs from '@/components/application/elements/Tabs'
import LoadingIcon from '@/components/application/elements/loading/LoadingIcon'
import Drive from '@/components/application/files/organised/Drive'
import Contributions from '@/components/application/profile/Contributions'
import ProfileDataSets from '@/components/application/profile/ProfileDataSets'
import ProfileStats from '@/components/application/profile/ProfileStats'
import Recommendations from '@/components/application/profile/Recommendations'
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
  const { address } = useAccount()
  const [select, setSelect] = useState("Contributions")
  const [loading, setLoading] = useState(true)
  const mounted = useIsMounted()
  

  
  useEffect(() => {
    if (mounted) {
      setLoading(false)
    }
    
  }, [address, mounted])


  const setSelected = (tab) => {
    setSelect(tab)
    mounted && setLoading(false)
  }


  if (loading) { return <LoadingIcon height={64} /> }

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
        </div>
      </div>
    
    </Layout>


  )
}

