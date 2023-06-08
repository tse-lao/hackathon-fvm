import { useContract } from '@/hooks/useContract';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButton } from '../application/elements/buttons/ActionButton';
import DataNotFound from '../application/elements/message/DataNotFound';
import DataFormatPreview from '../marketplace/DataFormatPreview';

export default function JobDetails({ details, input }) {
    const[loading,setLoading ]  = useState(false);
    const [showMetadata, setShowMetadata] = useState(false)
    const {ExecuteJob} = useContract()

    
    if(details == undefined) {
        return  <DataNotFound message="We cannot find any data for this jobID" />
      
    }
    
    const startComputing = async () => {
        console.log("starting job")
        setLoading(true)
        
        console.log(details);
        fetch(`${process.env.NEXT_PUBLIC_BACALHAU_SERVER}/startJob`)
        toast.promise(ExecuteJob(details.jobID, [], 0.001), {
            pending: `Pending transaction for execution for job ${details.jobID}...`,
            success: 'Job started!',
            error: 'Error starting job',
        }).then(() => {
            setLoading(false)
          
        })
    }
    



    return (
        <div className="flex w-full flex-col gap-3 text-sm px-8 py-4 bg-white'">
                    <h1 className='text-lg font-bold'>{details.name}</h1>
                    <span>
                        {details.description} <br />
                        <time className='text-xs italic text-gray-500'>{details.createdAt}</time>
                    </span>
                    <div className=''>
                        {details.categories && details.categories.map((category, index) => (
                            <Category key={index} category={category} />
                        ))}
                    </div>
                    
                    <div>
                        <label>Bacalhau example</label>
                        <div className='flex gap-2'>
                            <span className='px-6 py-2 bg-black text-cf-500 rounded-md'>
                                {details.startCommand}  {details.endCommand}
                            </span>
                        </div>
                    </div>


                    <div className='overflow-auto text-xs text-cf-500 hover:text-cf-800'>
                        <Link href={`/profile/${details.owner}`}>
                            {details.owner}
                        </Link>
                    </div>
                    <span className='text-xs'> {details.jobCid} </span>
                    {details.input && details.input.map((input, index) => 
                        <span key={index} className='text-xs'> {input} </span>
                    )}

                    <ActionButton loading={loading} onClick={startComputing} text="Start Computation" /> 
                    
                    
                    
                    <a className='text-cf-500 text-center cursor:pointer'  onClick={() => setShowMetadata(!showMetadata)}>Show metadata</a>

                
                    {showMetadata && <DataFormatPreview cid={details.dataFormat} />}
                
    
        </div>

    )
}
