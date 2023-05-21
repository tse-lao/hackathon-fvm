import PerformJob from '@/components/jobs/PerformJob'
import { DB_main } from '@/constants'
import Layout from '@/pages/Layout'
import { usePolybase } from '@polybase/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
export default function Jobs({  }) {
    const [openModal, setOpenModal] = useState(false)
    const [datasets, setDatasets] = useState([])
    const [selected, setSelected] = useState([])
    const router = useRouter()
    const { jobid } = router.query
    const polybase = usePolybase();
    

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await polybase.collection('Jobs').where('id', '==', jobid).get()  
            console.log(data[0].data.dataFormat);
            const where = `WHERE ${DB_main}.dataFormatCID = '${data[0].data.dataFormat}' AND ${DB_main}.minimumRowsOnSubmission = 0`
            const result = await fetch(`/api/tableland/token/all?where=${where}`)
            const datasets = await result.json()
            console.log(datasets)
            setDatasets(datasets.result)
        }
        
        if(jobid){
            fetchData();
        }
    }, [jobid])
    
    const addSelected = async (dbCID) => {
        if(selected.includes(dbCID)){
            setSelected(selected.filter((item) => item !== dbCID))
        }else{
            setSelected([...selected, dbCID])
        }
    }


    return (
        <Layout title="Jobs" active="Jobs">

            <div className="flex justify-between mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    Jobs
                </h1>
            </div>


            <div className='flex flex-col gap-12 flex-wrap '>
                <div className='flex-auto py-4 px-8 bg-white '>
                    <PerformJob key="1" jobID={jobid} input={selected} />
                </div>
                <div className='grid sm:grid-cols-1 md: grid-cols-2 lg:grid-cols-2 gap-4'>
                    {datasets && datasets.map((dataset, index) => (
                        <div key={index} className={`grid sm:grid-cols-1 md:grid-cols-1 bg-white items-center px-4 py-4 ${selected.includes(dataset.tokenID) && 'outline'}`} onClick={() => addSelected(dataset.tokenID)} >
                            <span className='text-sm text-gray-600'>{dataset.tokenID} </span>
                            <span>  {dataset.dbName}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}