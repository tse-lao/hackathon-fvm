import { useContract } from "@/hooks/useContract";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNetwork, useSwitchNetwork } from "wagmi";
import ModalLayout from "../ModalLayout";
import { ActionButton } from "../application/elements/buttons/ActionButton";

export default function ExecuteJob({ data, input,  onClose, openModal, changeOpen }) {
    const { ExecuteJob } = useContract();
    const { chain } = useNetwork();
    const [loading,setLoading] = useState(false)
    const { switchNetwork } = useSwitchNetwork()


    const [errorMessage, setErrorMessage] = useState(null);
    const HYPERSPACE_ID = 3141;
    const POLYGON = 80001;


    const startComputing = async () => {
        setLoading(true)
        
        fetch(`${process.env.NEXT_PUBLIC_BACALHAU_SERVER}/startJob`)
        console.log(data.jobID, [], 0)
        toast.promise(ExecuteJob(data.jobID, [], 0.001), {
            pending: `Pending transaction for execution for job ${data.jobID}...`,
            success: 'Job started!',
            error: 'Error starting job',
        }).then(() => {
            setLoading(false)
            onClose;
        })
    }
    
    
    return (
        <ModalLayout title="Execute Job" setOpen={onClose} getOpen={openModal}  changeOpen={changeOpen}>
            <div className="flex flex-col w-full h-full py-6 gap-4">
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                <div className='flex flex-col'>
                    <label className="font-bold">Jobid: {data.jobID}</label>
                    <span>Testing</span>
                    <span>{data.name}</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">Description</label>
                    <span>{data.description}</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">Job Input</label>
                    <span>{input}</span>
                </div>

               <ActionButton loading={loading} onClick={startComputing} text="Start Computation" /> 

            </div>
        </ModalLayout>
    )
}
