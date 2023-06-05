import { ModalButton } from "@/components/application/elements/buttons/ModalButton";
import { useState } from "react";
import CreateBountyProposal from "./CreateBountyProposal";

//TODO: implement later. 
export default function JobBountyProposals() {
  const [openModal, setOpenModal] = useState(false)
  return (
    <div>
      <ModalButton onClick={() => setOpenModal(!openModal)}  text="open Modal" />
      {openModal && <CreateBountyProposal onClose={() => setOpenModal(!openModal)}
          openModal={openModal}
      />} 
      
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <span className="text-md font-bold ">Proposal 1</span>
          <span className="text-gray-700 text-sm">0x1234567890</span>
        </div>
    </div>
    </div>
    
  )
}
