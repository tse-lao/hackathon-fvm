import PerformJob from '@/components/jobs/PerformJob'
import { DB_main } from '@/constants'
import Layout from '@/pages/Layout'
import { usePolybase } from '@polybase/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
export default function Jobs({ }) {
    const [openModal, setOpenModal] = useState(false)
    const [datasets, setDatasets] = useState([])
    const [selected, setSelected] = useState([])
    const [selectedOption, setSelectedOption] = useState("datasets")
    const router = useRouter()
    const { jobid } = router.query
    const polybase = usePolybase();


    useEffect(() => {
        const fetchData = async () => {
            const { data } = await polybase.collection('Jobs').where('id', '==', jobid).get()
            const where = `WHERE ${DB_main}.dataFormatCID = '${data[0].data.dataFormat}' AND ${DB_main}.minimumRowsOnSubmission = 0`
            const result = await fetch(`/api/tableland/token/all?where=${where}`)
            const datasets = await result.json()
            setDatasets(datasets.result)


            const computations = await fetch(`/api/tableland/computations?`)
        }

        if (jobid) {
            fetchData();
        }
    }, [jobid])

    const addSelected = async (dbCID) => {
        if (selected.includes(dbCID)) {
            setSelected(selected.filter((item) => item !== dbCID))
        } else {
            setSelected([...selected, dbCID])
        }
    }

    const renderContent = () => {
        if (selectedOption === 'datasets') {
            // return <DatasetsView />; Uncomment this line and define DatasetsView component accordingly
            return <div className='grid sm:grid-cols-1 md: grid-cols-1 lg:grid-cols-1 gap-4'>
                {datasets && datasets.map((dataset, index) => (
                    <div key={index} className={`grid sm:grid-cols-1 md:grid-cols-1 bg-white items-center px-4 py-4 ${selected.includes(dataset.dbCID) && 'outline'}`} onClick={() => addSelected(dataset.dbCID)} >
                        <span className='text-sm text-gray-600'>{dataset.tokenID} </span>
                        <span>  {dataset.dbCID}</span>
                    </div>
                ))}
            </div> // Replace this placeholder with your actual Datasets View component
        } else if (selectedOption === 'jobs') {
            // return <JobsView />; Uncomment this line and define JobsView component accordingly
            return <div>Jobs View</div>  // Replace this placeholder with your actual Jobs View component
        }
    }


    return (
        <Layout title="Jobs" active="Jobs">

            <div className="flex justify-between mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    Jobs
                </h1>
            </div>


            <div className='grid md:grid-cols-4  '>
                <PerformJob className="col-span-1" key="1" jobID={jobid} input={selected} />

                <div className='col-span-3 ml-24 flex flex-col'>
                    <div className="flex gap-2">
                        <button
                            className={`py-2 px-4 text-left ${selectedOption === 'datasets' ? 'bg-gray-200' : ''}`}
                            onClick={() => setSelectedOption('datasets')}
                        >
                            Datasets
                        </button>
                        <button
                            className={`py-2 px-4 text-left ${selectedOption === 'jobs' ? 'bg-gray-200' : ''}`}
                            onClick={() => setSelectedOption('jobs')}
                        >
                            Performed Jobs
                        </button>
                    </div>
                    <div className="flex-grow p-4">
                    {renderContent()}
                </div>
                </div>
               
            </div>
        </Layout>
    )
}