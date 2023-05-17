
import AllJobs from '@/components/jobs/AllJobs'
import CreateJob from '@/components/jobs/CreateJob'
import PerformJob from '@/components/jobs/PerformJob'
import Layout from '@/pages/Layout'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Jobs({ children }) {
    const [openModal, setOpenModal] = useState(false)
    const router = useRouter()
    const { jobid } = router.query


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


            <div className='flex  gap-12 flex-wrap '>
                <div className='flex-none bg-white py-4 px-8 max-h-full overflow-auto max-w-[360px]'>
                    <AllJobs />
                </div>
                <div className='flex-auto py-4 px-8 bg-white '>
                    <PerformJob jobID={jobid} />
                </div>
            </div>
        </Layout>
    )
}