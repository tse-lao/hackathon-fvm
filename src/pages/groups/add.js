"use client"


import { TextField } from '@/components/Fields';
import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import TextArea from '@/components/application/elements/input/TextArea';
import AddMember from '@/components/groups/AddMember';
import GroupView from '@/components/groups/details/GroupView';
import { useContract } from '@/hooks/useContract';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import Layout from '../Layout';


export default function CreateGroup() {
    const {createMultisig} = useContract();
    const {address} = useAccount();
    const [loading,setLoading] = useState(false);

    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        minimumSignatures: 0,
        name: "", 
        description: "",
        owners: [],
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const createGroup = async (e) => {
        e.preventDefault();
        // Process the form data and send it to the server or API endpoint.

        console.log(formData);
        
        setLoading(true)
        if(formData.owners.length === 0 || formData.minimumSignatures < 1){
            toast.error("Please add at least one owner or signatures.");
            setLoading(false);
            return;
        }
        

  
        if(!formData.owners.includes(address)){
            toast.error("You must be an owner of the group.");
            setLoading(false);
            return;
        }
        //only list of onwers. 
        toast.promise(createMultisig(
            formData.name, 
            formData.description,
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


        let newOwner = formData.owners;
        //check if its already on there
        if(newOwner.includes(e)){
            toast.error("This address is already on the list.");
            return;
        }
        newOwner.push(e);
        setFormData({ ...formData, owners: newOwner });
        setOpenModal(!openModal);
    }

    return (
        <Layout active="Groups">
        <div className="flex flex-col items-center justify-center">
        <div className='flex  items-center mb-6'>
            <ArrowLeftIcon className="h-6 w-6 cursor-pointer mr-6" onClick={() => router.push('/groups')} />
            <span className="text-3xl font-bold">Create Group</span>
            
        </div>

      
        <div className="flex flex-col gap-4 w-[480px]">
          <TextField
            label="Name"
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
          />
      
          <TextArea
            label="Description"
            rows={2}
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
          />
      
          <TextField
            label="Min Signatures"
            type="number"
            name="minimumSignatures"
            id="minimumSignatures"
            value={formData.minimumSignatures}
            onChange={handleChange}
          />
      
          <GroupView addedMembers={formData.owners} add={true} />
          <AddMember showModal={openModal} addMember={addMember} />
      
          <ActionButton
            text="Create Group"
            onClick={createGroup}
            loading={loading}
          />
        </div>
      </div>
      
            </Layout>
    )
}
