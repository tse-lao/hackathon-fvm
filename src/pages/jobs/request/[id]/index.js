import JobBountyDetail from '@/components/jobs/request/detail/JobBountyDetail'
import Layout from '@/pages/Layout'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

//

export default function JobBountyDetailPage() {
    const { query } = useRouter()
    
    //fidplsu bounyy

    useEffect(() => {
        //TODO: read here all the functions that can be done. 

        // [] financial contributors.
        // [] code contirbutors. 
        // [] code reviewers.
        // [] button for payment. 
        // [] timeline of interactions. 
        // [] options to change proposal.

    }, [query.id])

    return (
        <Layout>
            <div className='flex flex-col items-center justify-center gap-12'>
                <div className='flex gap-12'>
                    <span className='hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full'>Details</span>
                    <span className='hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full'>Contributors</span>
                    <span className='hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full'>Sponsors</span>
                    <span className='hover:bg-cf-500 px-4 py-2 cursor-pointer hover:text-white rounded-full'>Contract</span>
                </div>
                
                <div className='bg-white w-[800px] p-8 rounded-md '>
                    <JobBountyDetail id={1}/>
                    
                </div>
            </div>

        </Layout>
    )
}
