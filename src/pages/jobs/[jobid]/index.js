import Tabs from '@/components/application/elements/Tabs'
import JobDetails from '@/components/jobs/JobDetails'
import JobComputations from '@/components/jobs/details/JobComputations'
import JobDatasets from '@/components/jobs/details/JobDatasets'
import Layout from '@/pages/Layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { usePolybase } from '@polybase/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


const tabs = [
    { name: 'Details', href: '#', current: true },
    { name: 'Datasets', href: '#', current: false },
    { name: 'Computations', href: '#', current: false },

  ]
  

export default function Jobs() {
    const [openModal, setOpenModal] = useState(false)
    const [datasets, setDatasets] = useState([])
    const [details, setDetails] = useState(null)
    const [select, setSelect] = useState("Details")
    const [selectedOption, setSelectedOption] = useState("datasets")
    const router = useRouter()
    const { jobid } = router.query
    const polybase = usePolybase();


    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`/api/tableland/jobs/single?jobID=${jobid}`)
            const datasets = await result.json()
            console.log(datasets.result[0])
            setDetails(datasets.result[0])
            


        }

        if (jobid) {
            fetchData();
        }
    }, [jobid])

    const setSelected = (tab) => {
        setSelect(tab)
      }

    return (
        <Layout title="Jobs" active="Jobs">
            <div className='mx-32'>
            <div className="flex m-8 gap-8">
                <ArrowLeftIcon height={32 } onClick={() => router.back()}/>
                <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                    Jobs
                </h1>
            </div>
        
            <Tabs tabs={tabs} selected={setSelected} active={select} />
            <div className='mt-12'>
              {select === "Details" && <JobDetails details={details} key="1" jobID={jobid}  />}
              {select === "Datasets" && <JobDatasets jobID={jobid} />}
              {select === "Computations" && <JobComputations jobID={jobid} />}
            </div>
            </div>
        </Layout>
    )
}