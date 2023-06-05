import Tabs from '@/components/application/elements/Tabs'
import JobDetails from '@/components/jobs/JobDetails'
import JobComputations from '@/components/jobs/details/JobComputations'
import JobDatasets from '@/components/jobs/details/JobDatasets'
import { DB_main } from '@/constants'
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
    const [select, setSelect] = useState("Details")
    const [selectedOption, setSelectedOption] = useState("datasets")
    const router = useRouter()
    const { jobid } = router.query
    const polybase = usePolybase();


    useEffect(() => {
        const fetchData = async () => {
            const { data } = await polybase.collection('Jobs').where('id', '==', jobid).get()
            console.log(data)
            const where = `WHERE ${DB_main}.dataFormatCID = '${data[0].data.dataFormat}'`
            const result = await fetch(`/api/tableland/token/all?where=${where}`)
            const datasets = await result.json()
            console.log(datasets)
            setDatasets(datasets.result)


            const computations = await fetch(`/api/tableland/computations?`)
        }

        if (jobid) {
          //  fetchData();
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
              {select === "Details" && <JobDetails className="col-span-1" key="1" jobID={jobid}  />}
              {select === "Datasets" && <JobDatasets jobID={jobid} />}
              {select === "Computations" && <JobComputations jobID={jobid} />}
            </div>
            </div>
        </Layout>
    )
}