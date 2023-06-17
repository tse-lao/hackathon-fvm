
import { ActionButton } from "@/components/application/elements/buttons/ActionButton";
import InputField from "@/components/application/elements/input/InputField";
import TextArea from "@/components/application/elements/input/TextArea";
import { useContract } from "@/hooks/useContract";
import { useState } from "react";
import { toast } from "react-toastify";
import AddMember from "../AddMember";
import GroupView from "./GroupView";

export default function GroupDetail({ members, details, address }) {
  const [addMembers, setAddMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const { multisigAddMemberProposal } = useContract();
  const [added, setAdded] = useState(false)
  const [confirmations, setConfirmations] = useState(0)
  const [description, setDescription] = useState("")
  const [name, setName] = useState("")

  const addMember = (member) => {
    console.log(member)
    setAdded(true)
    setAddMembers([...addMembers, member])

  }

  const submitMember = () => {
    setLoading(true)
    console.log(addMembers[0]);
    console.log(address);




    toast.promise(multisigAddMemberProposal(address, addMembers[0], confirmations, name, description), {
      pening: "Creating multisig...",
      success: "Multisig created",
      error: "Error creating multisig",
    })

    setLoading(false)
  }
  return (
    <div className="flex flex-col gap-4">




      {members && (
        <div className="flex flex-col">
          <GroupView members={members} />
          <div className="flex flex-col gap-2">
            <AddMember addMember={addMember} />
          </div>
          {added && (
            <div className="grid grid-cols-2  gap-2 m-4">
              <div className="col-span-1">
                <InputField
                  label="Name"
                  type="type"
                  placeholder="Create name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
              <div className="col-span-1">
                <InputField
                  label="Confirmations"
                  type="number"
                  placeholder="Set confirmations"
                  onChange={(e) => setConfirmations(e.target.value)}
                  value={confirmations}
                />
              </div>
              <div className="col-span-2">
              <TextArea
              label="Description"
              type="text"
              rows={2}
              placeholder="Type description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
              </div>


             

              <ActionButton onClick={submitMember} loading={loading} text="Add Member" />
            </div>
          )}
        </div>
      )
      }
    </div>
  )
}
