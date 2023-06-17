import DataNotFound from "@/components/application/elements/message/DataNotFound";
import { useEffect, useState } from "react";

import { useAccount } from "wagmi";
import ProposalItem from "./ProposalItem";

export default function IndividualProposal({address}) {
  const [proposals, setProposals] = useState([])
  const {address:user} = useAccount()

  
    
    useEffect(() => {
      //proposalTable, confirmationTable
      const getData = async() => {
        
        //TODO: ADD the multlisig for collecting all the multisigs and individual is un.
        //const res = await fetch(`/api/tableland/multisig/proposal?proposalTable=${proposalTable}&confirmationTable=${confirmationTable}&executed='false'`)
        //const result = await res.json()
        //console.log(result)
        let result = {result: []}
        if(result){
          setProposals(result.result)
        }
        
      }    
      

      getData()
      
      
    }, [address])
  return (
    <div className="flex flex-col gap-2">
        {proposals.length > 0 ? proposals.map((proposal, key) => (
          <ProposalItem key={key} proposal={proposal} numberOfConfirmations={numberOfConfirmations} multiSigAddress={address}/>
        )): <DataNotFound message="No proposals found"/>
        }
    </div>
    

    

  )
}
