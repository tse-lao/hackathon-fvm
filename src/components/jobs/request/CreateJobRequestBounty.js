import { ModalButton } from "@/components/application/elements/buttons/ModalButton";
import { useState } from "react";
import CreateJobRequestBountyModal from "./CreateJobRequestBountyModal";

export default function CreateJobRequestBounty() {
    const [modalOpen, setModalOpen] = useState(false)
    

  return (
    <div>
      <ModalButton onClick={() => {setModalOpen(!modalOpen); console.log(!modalOpen)}} text="Create Job Bounty "/>
      {modalOpen && <CreateJobRequestBountyModal getOpen={modalOpen} onClose={() => {setModalOpen(!modalOpen); console.log(!modalOpen)}} />}
    </div>
  )
}
