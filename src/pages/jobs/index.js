
import LoadingFull from '@/components/application/elements/loading/LoadingFull'
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
            setLoading(true)

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
            {openModal ? <CreateJob onClose={() => setOpenModal(!openModal)} /> :
                (
                    <div>
                        <div className="grid grid-cols-2 text-center mb-4">
                            <Link className="col-span-1 text-cf-500 font-md " href="/jobs" >Verified Jobs</Link>
                            <Link className="col-span-1" href="/jobs/request">Jobs Request</Link>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 sm:grid-cols-1 flex-col justify-center">
                            <AllJobs jobs={jobs} />
                            </div>


                    </div>
                )

            }


            <button
                className="fixed bottom-12 right-12 bg-cf-500 text-white px-4 py-2 rounded"
                onClick={() => { setOpenModal(!openModal) }}
            >
                Create Job
            </button>

        </Layout>
    )
}