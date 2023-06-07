
import LoadingFull from '@/components/application/elements/loading/LoadingFull'
import PageTitle from '@/components/application/elements/text/PageTitle'
import CreateJob from '@/components/jobs/CreateJob'
import AllJobs from '@/components/jobs/JobList'
import { computation } from '@/constants'
import Layout from '@/pages/Layout'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Jobs({ children }) {
    const [openModal, setOpenModal] = useState(false)
    const [performed, setPerformed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [jobs, setJobs] = useState([])

    //call tableland to retrieve this data. 
    useEffect(() => {
        //getting all the computations stored in there. 
        const getData = async () => {
            setLoading(false)

            let query = `WHERE ${computation}.verified='true'`;

            //TODO: add filters later or maybe one search bar. 

            const computations = await fetch(`/api/tableland/jobs/all`);
            const data = await computations.json();

            console.log(data.result)
            setJobs(data.result)

            setLoading(false)
        }

        getData();
    }, [])



    const changeStatus = (e) => {
        setPerformed(e)
    }

    if (loading) return <LoadingFull />
    return (
        <Layout title="Jobs" active="Jobs">
            <div className="flex justify-between mb-12">
            <div className='flex flex-col gap-6'>
                <PageTitle title='Jobs' />
                <Link href="/jobs/request" className='text-cf-500'>Open requests</Link>
            </div>
                <button
                    onClick={() => setOpenModal(!openModal)}
                    className="bg-cf-500 hover:bg-cf-700 self-end text-white font-bold py-2 px-4 rounded-full">
                        Create Job
                </button>
                {openModal && <CreateJob onClose={() => setOpenModal(false)} />}
            </div>
            <div className='flex flex-row gap-12 flex-wrap'>
                <div className='grid grid-cols-2 py-4 px-8 max-h-full overflow-auto gap-6 items-center'>
                    <AllJobs jobs={jobs}  />
                </div>
            </div>
        </Layout>
    )
}