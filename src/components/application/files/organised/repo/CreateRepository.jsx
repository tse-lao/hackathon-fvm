import { TextField } from '@/components/Fields';
import ModalLayout from '@/components/ModalLayout';
import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import TextArea from '@/components/application/elements/input/TextArea';
import { useContract } from '@/hooks/useContract';
import { useState } from "react";
import TagsInput from 'react-tagsinput';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

export default function CreateRepository({ changeOpenModal }) {
    const {createPrivateRepo} = useContract();
const {address} = useAccount();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        owners: [],
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    
    const handleViewers = (tags) => {
        setFormData({ ...formData, owners: tags });
    };
    

    const createRepository = async (e) => {
        e.preventDefault();
        // Process the form data and send it to the server or API endpoint.
        console.log(formData);
        
        if(formData.name.length < 3 || formData.name.length > 250 ){
            toast.error("Repository name must be between 3 and 250 characters.")
            return;
        }
        if(formData.description.length < 10 || formData.description.length > 1000 ){
            toast.error("Description should be between 1000.");
            return;
        }
        
        formData.owners.push(address);
        
        toast.promise(createPrivateRepo(
            formData.name,
            formData.description,
            formData.owners
          ), 
          {
            pending: "Creating Repository...",
            success: "Repository Created.",
            error: "Error creating repository."
          }).then((result) => {
            if(result){
                window.location.reload();
            }
          });
       
    };

    return (
        <ModalLayout onClose={changeOpenModal}>
            <div className="flex flex-col gap-4">
                <TextField
                    label="Repository Name"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextArea
                    label="Description"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                />
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Owners</label>
                    <TagsInput
                        value={formData.owners}
                        onChange={handleViewers}
                    />
                </div>
                <ActionButton text
                ="Create Repository" onClick={createRepository} />
            </div>
        </ModalLayout>
    )
}
