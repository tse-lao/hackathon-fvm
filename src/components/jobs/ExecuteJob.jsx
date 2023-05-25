import { useContract } from "@/hooks/useContract";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNetwork, useSwitchNetwork } from "wagmi";
import ModalLayout from "../ModalLayout";
import { ActionButton } from "../application/elements/buttons/ActionButton";
import { OpenButton } from "../application/elements/buttons/OpenButton";

export default function ExecuteJob({ data, input, jobID,  onClose, openModal, changeOpen }) {
    const { callLillypadJob } = useContract();
    const { chain } = useNetwork();
    const [loading,setLoading] = useState(false)
    const { switchNetwork } = useSwitchNetwork()


    const [errorMessage, setErrorMessage] = useState(null);
    const HYPERSPACE_ID = 3141;
    const POLYGON = 80001;


    const startComputing = async () => {
        setLoading(true)
        console.log(data.spec_start, data.spec_end, data.id)
        console.log(input[0])
        
        toast.promise(callLillypadJob(input[0], data.spec_start, data.spec_end, data.id), {
            pending: `Pending transaction for execution for job ${data.id}...`,
            success: 'Job started!',
            error: 'Error starting job',
        }).then(() => {
            setLoading(false)
            if(chain.id != HYPERSPACE_ID){
                switchNetwork?.(POLYGON)
            }
            onClose()
        })
    }
    
    
    return (
        <ModalLayout title="Execute Job" setOpen={onClose} getOpen={openModal}  changeOpen={changeOpen}>
            <div className="flex flex-col w-full h-full py-6 gap-4">
                {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                <div className='flex flex-col'>
                    <label className="font-bold">Job {data.id}</label>
                    <span>{data.name}</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">Description</label>
                    <span>{data.description}</span>
                </div>
                <div className='flex flex-col'>
                    <label className="font-bold">Job Input</label>
                    <span>{input[0]}</span>
                </div>

                {chain.id == HYPERSPACE_ID ? <ActionButton loading={loading} onClick={startComputing} text="Start Computation" /> :
                    <OpenButton text="Change to HyperSpace"
                        onClick={() => switchNetwork?.(HYPERSPACE_ID)}
                    />
                }

            </div>
        </ModalLayout>
    )
}
