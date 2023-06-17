import { useState } from "react";
import CreateJob from "./CreateJob";
import AllJobs from "./JobList";

export default function ComputationalOverview({ tokenID, dataFormat }) {
    const [openModal, setOpenModal] = useState(false)

    const changeOpen = (e) => {
        setOpenModal(e)
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <CreateJob changeOpen={changeOpen} getOpen={openModal} dataFormat={dataFormat} />
            <div className='flex flex-row gap-12 flex-wrap'>
                <div className='grid sm:grid-cols-1  md:grid-cols-2  max-h-full overflow-auto gap-4'>
                    <AllJobs dataFormat={dataFormat} />
                </div>
            </div>
            <button onClick={() => setOpenModal(true)}
                className="bg-cf-500 flex-1 hover:bg-cf-700 self-end text-white font-bold py-2 px-4 rounded-full content-end mt-4" >
                Create New Job
            </button>
        </div>


    )
}
