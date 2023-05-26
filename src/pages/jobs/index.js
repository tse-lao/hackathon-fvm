
import Toggle from '@/components/application/Toggle'
import AllJobs from '@/components/jobs/AllJobs'
import CreateJob from '@/components/jobs/CreateJob'
import Layout from '@/pages/Layout'
import { useState } from 'react'

export default function Jobs({ children }) {
    const [openModal, setOpenModal] = useState(false)
    const [performed, setPerformed] = useState(false)

    const changeOpen = (e) => {
        setOpenModal(e)
    }

    const changeStatus = (e) => {
        setPerformed(e)
    }

    return (
        <Layout title="Jobs" active="Jobs">
            <div className="flex justify-between mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    Jobs
                </h1>
                <button
                    onClick={() => setOpenModal(true)}
                    className="bg-cf-500 hover:bg-cf-700 self-end text-white font-bold py-2 px-4 rounded-full"
                >
                    <CreateJob changeOpen={changeOpen} getOpen={openModal} />
                    Create a JOB
                </button>
            </div>
            <Toggle text="Show performed jobs" changeStatus={changeStatus} />
            <div className='flex flex-row gap-12 flex-wrap'>
                <div className='grid grid-cols-2 py-4 px-8 max-h-full overflow-auto gap-6'>
                    <AllJobs performed={performed} />
                </div>
            </div>
        </Layout>
    )
}