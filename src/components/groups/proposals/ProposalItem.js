import { useContract } from "@/hooks/useContract";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

export default function ProposalItem({ proposal, numberOfConfirmations, multiSigAddress }) {
    const { multisigConfirmTransaction, multisigExecuteTransaction } = useContract();
    const [status, setStatus] = useState(0);
    const {address} = useAccount();
    
    useEffect(() => {
        if(proposal.executed == 'true'){
            setStatus(3)
            return
        }
        if (proposal.confirmations.length >= numberOfConfirmations) {
            
            setStatus(1);
            return
        }
        if(proposal.confirmations.includes(address.toLowerCase())){
            setStatus(2);
            return
        }
    }, [proposal.confirmations.length])
    
    const confirmProposal = async () => {


        toast.promise(multisigConfirmTransaction(multiSigAddress, proposal.proposalID), {
            pending: 'Confirming proposal',
            success: 'Confirmed proposal',
            error: 'Error confirming proposal'
        })


    }
    return (
        <div className="bg-white grid grid-cols-4 rounded-md p-2 border place-content-center items-center px-4">
            <div className="col-span-3 flex flex-col">
            <span className="font-md text-gray-700">{proposal.name}</span>
                
                <span className="text-sm text-gray-500">{proposal.description}</span>

            </div>
            <div className="col-span-1 content-end text-end">
                {status == 1 && 
                <button onClick={confirmProposal} className="bg-cf-500 px-4 py-2 rounded-md text-white">
                    Execute vote
               </button>
                }
                {status == 0 && <button onClick={confirmProposal} className="bg-cf-500 px-4 py-2 rounded-md text-white">
                    {proposal.confirmations.length}/{numberOfConfirmations}
                </button>
            }
                {status == 2 && 
                  <span className="text-center">Already voted <br />
                  {proposal.confirmations.length}/{numberOfConfirmations}
                  </span>
            }
            {status == 3 && 
                <span className="text-center text-cf-500">Executed</span>
          }
                

            </div>

        </div>
    )
}
