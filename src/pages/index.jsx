import Avatar from '@/components/application/elements/Avatar'
import Tabs from '@/components/application/elements/Tabs'
import LoadingIcon from '@/components/application/elements/loading/LoadingIcon'
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
      <div className='bg-white rounded-sm flex items-center py-6 px-12 mt-12'>
        <div className='mr-12'>
          {mounted && <Avatar height={64} className='mr-12' creator={address} />}
        </div>


        <div>
          <span className='text-sm text-gray-600 mt-2 uppercase'>Welcome</span>
          <h1 className='text-lg font-bold leading-7 text-gray-700'>{address && address}</h1>
        </div>

      </div>
      <Tabs tabs={tabs} selected={setSelected} active={select} />
      <div className='flex mt-12'>
        {select === "Contributions" && <Contributions creator={address} />}
        {select === "DataSets" && <ProfileDataSets creator={address} />}
        {select === "Recommendation" && <Recommendations address={address} />}
      </div>
    </Layout>


  )
}

