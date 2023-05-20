import { useState } from "react";
import AllJobs from "./AllJobs";
import CreateJob from "./CreateJob";

export default function ComputationalOverview({ tokenID, dataFormat }) {
    const [openModal, setOpenModal] = useState(false)

    const changeOpen = (e) => {
        setOpenModal(e)
    }

    return (
        <div className="flex flex-col items-center justify-center">
       
            <CreateJob changeOpen={changeOpen} getOpen={openModal} dataFormat={dataFormat} />
            <div className="bg-white flex flex-col items-center px-6 py-6 content-center max-h-[500px] overflow-scroll">
                <AllJobs dataFormat={dataFormat} />
            </div>
            <button onClick={() => setOpenModal(true)}
            className="bg-cf-500 flex-1 hover:bg-cf-700 self-end text-white font-bold py-2 px-4 rounded-full content-end mt-4" >
            Create New Job
        </button>
        </div>


    )
}
