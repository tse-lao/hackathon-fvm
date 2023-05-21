import { useContract } from "@/hooks/useContract";
import { useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import ModalLayout from "../ModalLayout";
import { ActionButton } from "../application/elements/buttons/ActionButton";
import { OpenButton } from "../application/elements/buttons/OpenButton";

export default function ExecuteJob({ data, input, jobID,  onClose }) {
    const { callLillypadJob } = useContract();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork()


    const [errorMessage, setErrorMessage] = useState(null);
    const HYPERSPACE_ID = 3141;
    const POLYGON = 80001;


    const startComputing = async () => {
        console.log(data.spec_start, data.spec_end, data.id)
        console.log(input[0])
        callLillypadJob(input[0], data.spec_start, data.spec_end, data.id).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
            setErrorMessage(error.message);
        })
    }
    return (
        <ModalLayout title="Execute Job" onClose={onClose}>
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

                {chain.id == HYPERSPACE_ID ? <ActionButton onClick={startComputing} text="Make Deal" /> :
                    <OpenButton text="Change to HyperSpace"
                        onClick={() => switchNetwork?.(HYPERSPACE_ID)}
                    />
                }

            </div>
        </ModalLayout>
    )
}
