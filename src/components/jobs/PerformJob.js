import { usePolybase } from '@polybase/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Category from '../application/elements/Category';
import DataFormatPreview from '../marketplace/DataFormatPreview';

export default function PerformJob({ jobID }) {
    const polybase = usePolybase();
    const [details, setDetails] = useState(null)

    useEffect(() => {
        const fetchJob = async () => {
            const job = await getJob(jobID);
            console.log(job)
            setDetails(job);
        }

        if (jobID) {
            fetchJob();
        }
    }, [jobID])

    const getJob = async (jobID) => {
        const { data } = await polybase.collection("Jobs").where("id", "==", jobID).get()
        console.log(data[0].data);
        return data[0].data;
    }
    
    const startComputing = async () => {
        toast.info("Starting computation...")
    }


    if (details === null) { return "something" }
    
    return (
        
        
        <div className='max-w-[700px]'>

            <div className='flex gap-12'>
            
                <div className='max-w-[300px] text-md outline bg-gray-100 text-indigo-500 rounded-md'>
                    <DataFormatPreview cid={details.dataFormat} />
                </div>
                <div className='flex flex-col gap-3 text-sm overflow-auto w-fit'>
                <h1 className='text-lg font-bold'>{details.name}</h1>
                <span>
                    {details.description} <br />
                    <time className='text-xs italic text-gray-500'>{details.createdAt}</time>
                </span>
                <div className=''>
                {details.categories && details.categories.map((category) => (
                    <Category category={category} />
                ))}
                </div>
              
                
                <div className='overflow-auto text-xs text-cf-500 hover:text-cf-800'>
                    <Link href={`/profile/${details.owner}`}>
                    {details.owner}
                    </Link>
                </div>
                <span className='text-xs'>
                    {details.jobCid}
                </span>
                
                <button
                    className='bg-cf-500 hover:bg-cf-700 text-white font-bold py-2 px-4 rounded-full'
                    onClick={startComputing}
                >
                    Start computing
                </button>
                

                </div>
                
                
            </div>

        </div>

    )
}