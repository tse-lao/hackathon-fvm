import GroupView from "@/app/components/users/GroupView";
import { ActionButton } from "@/components/application/elements/buttons/ActionButton";
import InputField from "@/components/application/elements/input/InputField";
import TextArea from "@/components/application/elements/input/TextArea";
import { useContract } from "@/hooks/useContract";
import { useState } from "react";
import { toast } from "react-toastify";
import AddMember from "../AddMember";

export default function GroupDetail({ members, details, address }) {
  const [addMembers, setAddMembers] = useState([])
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
    //here wec call the function to add a memmber to the multisig. 

    console.log(addMembers[0]);
    console.log(address);




    toast.promise(multisigAddMemberProposal(address, addMembers[0], name, description), {
      pening: "Creating multisig...",
      success: "Multisig created",
      error: "Error creating multisig",
    });
  }
  return (
    <div className="flex flex-col gap-4">
    



      {members && (
        <div className="flex flex-col gap-4">
          <GroupView members={members}  />
          <div className="flex flex-col gap-2">
            <span>New member</span>
            <AddMember addMember={addMember} />
          </div>
          {added && (
            <div className="flex flex-col gap-2">
              <InputField
                label="Name"
                type="type"
                placeholder="Create name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />

              <TextArea
                label="Description"
                type="text"
                rows={2}
                placeholder="Type description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />

              <ActionButton onClick={submitMember} text="Add Member" />
            </div>
          )}
        </div>
      )
      }
</div>
      )
}
