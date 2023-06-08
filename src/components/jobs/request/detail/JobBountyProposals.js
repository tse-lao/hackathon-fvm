import { ModalButton } from "@/components/application/elements/buttons/ModalButton";
import { useCollection, usePolybase } from "@polybase/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import AssignBountyWinner from "./AssignBountyWinner";
import CreateBountyProposal from "./CreateBountyProposal";

//TODO: implement later. 
export default function JobBountyProposals({ bountyID, details }) {
  const [openModal, setOpenModal] = useState(false)
  const [proposals, setProposals] = useState([])
  const {address} = useAccount();
  const [selected, setSelected] = useState("");
  const polybase = usePolybase()
  const {data:proposal, loading} = useCollection(polybase.collection("BountyProposal").where('bountyID', '==', bountyID));
  console.log(details);
  return (
    <div>
    
      <ModalButton onClick={() => setOpenModal(!openModal)} text="Create" />
      {openModal && (address.toLowerCase()==details.creator ? <AssignBountyWinner selected={selected} bountyID={bountyID} /> : <CreateBountyProposal bountyID={bountyID} />)}

      <div className="flex flex-col gap-3 mt-6">
        
        {!loading && proposal.data.map((proposal) => (
          <div className={`flex flex-row justify-between hover:bg-gray-200 cursor-pointer ${selected == proposal.data && 'bg-cf-200'}`} onClick={() => setSelected(proposal.data)}>
            <span className="text-md font-bold ">{proposal.data.name}</span>
            <span className="text-gray-700 text-sm">{proposal.data.creator}</span>
          </div>
        ))}

      </div>
    </div>

  )
}
