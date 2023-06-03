import { ModalButton } from "@/components/application/elements/buttons/ModalButton";
import { useState } from "react";
import CreateJobRequestBountyModal from "./CreateJobRequestBountyModal";

export default function CreateJobRequestBounty() {
    const [modalOpen, setModalOpen] = useState(false)
    

  return (
    <div>
      <ModalButton onClick={() => setModalOpen(!modalOpen)} text="Create Job Bounty "/>
      {modalOpen && <CreateJobRequestBountyModal changeOpen={modalOpen} onClose={(e) => setModalOpen(false)} />}
    </div>
  )
}
