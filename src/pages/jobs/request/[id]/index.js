import LoadingFull from '@/components/application/elements/loading/LoadingFull'
import JobBountyDetail from '@/components/jobs/request/detail/JobBountyDetail'
import JobBountyProposals from '@/components/jobs/request/detail/JobBountyProposals'
import Layout from '@/pages/Layout'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function JobBountyDetailPage() {
    const router = useRouter()
    const { id } = router.query
    const  [loading, setLoading] = useState(true)
    const [active, setActive] = useState('details')
    const [details, setDetails] = useState({})


    //fidplsu bounyy

    useEffect(() => {
        //TODO: read here all the functions that can be done. 

        // [] financial contributors.
        // [] code contirbutors. 
        // [] code reviewers.
        // [] button for payment. 
        // [] timeline of interactions. 
        // [] options to change proposal.
            
        getBountyDetails();
        

    }, [id])
    
    async function getBountyDetails(){
        setLoading(true)
        let query = `WHERE bountyID = '${id}'}`
        const result = await fetch(`/api/tableland/jobs/all?where=${query}`)
        const datasets = await result.json()
        console.log(datasets.result[0])
        setDetails(datasets.result[0])
        
        setLoading(false)
    }

    if(loading) return <LoadingFull />
    
    
    return (
        <Layout>
            <div className='flex flex-col items-center justify-center gap-12 flex-wrap'>
                <div className='flex gap-12 flex-wrap'>
                    <span className='hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full' onClick={()=> setActive('details')}>Details</span>
                    <span className='hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full' onClick={()=> setActive('proposals')}>Proposals</span>
                    <span className='hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full'>Sponsors</span>
                    <span className='hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full'>Contract</span>
                </div>
                
                <div className='bg-white w-[800px] p-8 rounded-md '>
                    {active == 'details' && <JobBountyDetail id={1} details={details}/>}
                    {active == 'proposals' && <JobBountyProposals id={1} details={details}/>}

                    
                </div>
            </div>

        </Layout>
    )
}
