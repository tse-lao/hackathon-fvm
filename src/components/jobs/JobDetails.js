import { usePolybase } from '@polybase/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import Category from '../application/elements/Category';
import DataNotFound from '../application/elements/message/DataNotFound';
import DataFormatPreview from '../marketplace/DataFormatPreview';
import ExecuteJob from './ExecuteJob';

export default function JobDetails({ jobID, input }) {
    const polybase = usePolybase();
    const [details, setDetails] = useState(null)
    const [showMetadata, setShowMetadata] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const { chain } = useNetwork()
    const {switchNetwork} = useSwitchNetwork()
    const HYPERSPACE_ID = 3141;
    const POLYGON = 80001;
    useEffect(() => {

        const fetchJob = async () => {
            const job = await getJob(jobID);
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

    const changeOpen = (e) => {
        setOpenModal(e)
        console.log("closing up")
        console.log(chain.id)
        
        if(chain.id != POLYGON){
            switchNetwork?.(POLYGON)
        }

    }

    
    if(details == undefined) {
        return  <DataNotFound message="We cannot find any data for this jobID" />
      
    }


    return (
        <div className='max-w-[600px] flex flex-col gap-3 text-sm overflow-auto w-fit bg-white p-6'>
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


                    <div className='overflow-auto text-xs text-cf-500 hover:text-cf-800'>
                        <Link href={`/profile/${details.owner}`}>
                            {details.owner}
                        </Link>
                    </div>
                    <span className='text-xs'> {details.jobCid} </span>
                    {details.input && details.input.map((input, index) => 
                        <span key={index} className='text-xs'> {input} </span>
                    )}

                    <button
                        className='bg-cf-500 hover:bg-cf-700 text-white font-bold py-2 px-4 rounded-full'
                        onClick={() => setOpenModal(!openModal)}
                    >
                        Start computing
                    </button>
                    
                    <a className='text-cf-500 text-center cursor:pointer'  onClick={() => setShowMetadata(!showMetadata)}>Show metadata</a>

                
                    {showMetadata && <DataFormatPreview cid={details.dataFormat} />}
                    {openModal && <ExecuteJob data={details} input={input} openModal={openModal} changeOpen={changeOpen}/> }
    
        </div>

    )
}
