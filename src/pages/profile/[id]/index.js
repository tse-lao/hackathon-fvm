import Stat from '@/components/application/data/Stat'
import Avatar from '@/components/application/elements/Avatar'
import Tabs from '@/components/application/elements/Tabs'
import UserContributions from '@/components/application/profile/UserContributions'
import Layout from '@/pages/Layout'
import { useRouter } from 'next/router'
const tabs = [
  { name: 'Verified Connections', href: '#', current: true },
  { name: 'Contributions', href: '#', current: false },
  { name: 'Created DataSets', href: '#', current: false },
  { name: 'Chain Interactions', href: '#', current: false },
]


export default function Profile() {
    const router = useRouter()
    const {id} = router.query
    
    
  return (
    <Layout title="Profile">
        <div className='bg-white rounded-sm flex items-center py-6  px-12'>
            <Avatar creator={id} height="100" width="100" />
            <div>
            <span className='text-sm text-gray-600 mt-2 uppercase'>Welcome</span>
            <h1 className='text-lg font-bold leading-7 text-gray-700'>{id}</h1>
            </div>
            
        </div>
        <div className='mt-12 flex '>
        <div className='flex-grow'>
          <Tabs tabs={tabs} />
          
          <UserContributions creator={id} />
        </div>
        <div className=" flex flex-col px-12 py-12 gap-12">
          <Stat name="Lighthouse" current="12" total="1240 MB" change="12.3"/>
          <Stat name="Contribution" current="12" total="1000"/>
          <Stat name="Datasets" current="10" total=""/>
        </div>
          
        </div>
    </Layout>
  )
}

