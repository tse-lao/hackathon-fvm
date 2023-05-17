
import AllJobs from '@/components/jobs/AllJobs'
import CreateJob from '@/components/jobs/CreateJob'
import Layout from '@/pages/Layout'
import { useState } from 'react'

export default function Jobs({children}) {
    const [openModal, setOpenModal] = useState(false)

    const changeOpen = (e) => {
      setOpenModal(e)
    }
    
  
    return (
        <Layout title="Jobs" active="Jobs">
       
        <div className="flex justify-between mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        Jobs
    </h1>
                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-indigo-500 hover:bg-indigo-700 self-end text-white font-bold py-2 px-4 rounded-full"
                >
                    <CreateJob changeOpen={changeOpen} getOpen={openModal} />
                    Create a JOB
                </button>
            </div>
            
          
            <div className='flex flex-row gap-12 flex-wrap'>
                <div className='flex bg-white py-4 px-8 max-h-full overflow-auto'>                   
                    <AllJobs />
                </div>
                <div className='flex-auto py-4 px-8 bg-white'>
                    Please select a job to view its details.
                </div>
            </div>
        </Layout>
    )
}