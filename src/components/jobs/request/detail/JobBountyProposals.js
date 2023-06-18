import { useCollection, usePolybase } from "@polybase/react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AssignBountyWinner from "./AssignBountyWinner";
import CreateBountyProposal from "./CreateBountyProposal";

//TODO: implement later. 
export default function JobBountyProposals({ bountyID, details }) {
  const [openModal, setOpenModal] = useState(false)
  const [multiSig, setMultiSig] = useState(false)
  const {address} = useAccount();
  const [selected, setSelected] = useState("");
  const polybase = usePolybase()
  const {data:proposal, loading} = useCollection(polybase.collection("BountyProposal").where('bountyID', '==', bountyID));
  console.log(details);
  
  
  useEffect(() => {
      //check here if 
      if(details.members[0] != null) {setMultiSig(true); return;}
      
  }, [details])
  
  const clickSelect = (proposal) => {
    if(selected == proposal) return setSelected("");
    setSelected(proposal)
    
    console.log(proposal)
  }
  return (
    <div>
    
      <button
        className="fixed bottom-12 right-12 bg-cf-500 text-white px-4 py-2 rounded"
        onClick={() => setOpenModal(!openModal)}
      >
        Create 
      </button>
      {openModal && (
        (address.toLowerCase() == details.creator || details.members.includes(address.toLowerCase())) ? 
          <AssignBountyWinner selected={selected} bountyID={bountyID} multiSig={multiSig} address={details.creator}/> 
          :
         <CreateBountyProposal bountyID={bountyID} />
        )
      }

      <div className="flex flex-col gap-3 mt-6">
        
        {!loading && proposal.data.map((proposal) => (
          <div className={`flex flex-row bg-white py-4 border px-6 rounded-md justify-between hover:shadow-md cursor-pointer ${selected.id === proposal.data.id && 'bg-cf-300'}`} onClick={() => clickSelect(proposal.data)}>
            <span className="text-md font-bold ">{proposal.data.name}</span>
            <span className="text-gray-700 text-sm">{proposal.data.creator}</span>
          </div>
        ))}

      </div>
    </div>

  )
}
