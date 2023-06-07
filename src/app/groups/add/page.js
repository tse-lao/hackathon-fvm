"use client"
import GroupView from '@/app/components/users/GroupView';
import { TextField } from '@/components/Fields';
import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import AddMember from '@/components/groups/AddMember';
import { useContract } from '@/hooks/useContract';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';


export default function CreateGroup() {
    const {createMultisig} = useContract();
    const {address} = useAccount();
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        minimumSignatures: 0,
        owners: [],
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    
    const handleViewers = (tags) => {
        setFormData({ ...formData, owners: tags });
    };
    

    const createGroup = async (e) => {
        e.preventDefault();
        // Process the form data and send it to the server or API endpoint.
        console.log(formData);

  
        //only list of onwers. 
        toast.promise(createMultisig(
            formData.owners, 
            formData.minimumSignatures
          ), 
          {
            pending: "Creating Repository...",
            success: "Repository Created.",
            error: "Error creating repository."
          }).then((result) => {
            if(result){
                router.push('/groups')
            }
          });
       
    };
    
    const addMember = (e) => {
        console.log(e);
        console.log("adding");
        let newOwner = formData.owners;
        newOwner.push(e);
        setFormData({ ...formData, owners: newOwner });
        setOpenModal(!openModal);
    }

    return (
            <div className="flex flex-col gap-4 w-fit justify-self-center">
                <TextField
                    label="Min Signatures"
                    type="number"
                    name="minimumSignatures"
                    id="minimumSignatures"
                    value={formData.minimumSignatures}
                    onChange={handleChange}
                />

                <GroupView members={formData.owners} add={true}/>
                <AddMember showModal={openModal} addMember={addMember} />

                <ActionButton text
                ="Create Group" onClick={createGroup} />

             
            </div>
    )
}
