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
            
        if(id > 0){
            
            getBountyDetails();
        }
        

    }, [id])
    
    async function getBountyDetails(){
        setLoading(true)
        
        let query = `WHERE bountyID = '${id}'`
        console.log(query);
        const result = await fetch(`/api/tableland/bounty/all?where=${query}`)
        const datasets = await result.json()
        
        setDetails(datasets.result[0])
        
        setLoading(false)
    }

    if(loading) return <LoadingFull />
    
    
    return (
        <Layout>
            <div className='flex flex-col items-center justify-center gap-12 flex-wrap'>
                <div className='flex gap-12 flex-wrap'>
                    <span className={`hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full ${active === 'details' && 'bg-cf-500 text-white'}`} onClick={()=> setActive('details')}>Details</span>
                    <span className={`hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full ${active == 'proposals' && 'bg-cf-500 text-white'}`} onClick={()=> setActive('proposals')}>Proposals</span>
                    <span className={`hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full ${active == 'sponsor' && 'bg-cf-500 text-white'}`}>Sponsors</span>
                    <span className={`hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full ${active == 'contract' && 'bg-cf-500 text-white'}`}>Contract</span>
                </div>
                
                <div className='w-[800px] p-8 rounded-md '>
                    {active == 'details' && <JobBountyDetail id={id} details={details}/>}
                    {active == 'proposals' && <JobBountyProposals bountyID={id} details={details}/>}

                    
                </div>
            </div>

        </Layout>
    )
}
