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
        contributors: [],
        viewers: [],
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleContributors = (tags) => {
        setFormData({ ...formData, contributors: tags });
    };
    
    const handleViewers = (tags) => {
        setFormData({ ...formData, viewers: tags });
    };
    

    const createRepository = async (e) => {
        e.preventDefault();
        // Process the form data and send it to the server or API endpoint.
        console.log(formData);
        
        if(formData.name.length > 3 || formData.name.length < 50 ){
            toast.error("Repository name must be between.")
        }
        if(formData.description.length > 10 || formData.name.length < 1000 ){
            toast.error("Description should be between 1000.");
        }
        
        formData.viewers.push(address);
        formData.contributors.push(address);
        console.log(formData.viewers)
        console.log(formData.contributors)
        
        toast.promise(createPrivateRepo(
            formData.name,
            formData.description,
            formData.viewers,
            formData.contributors
          ), 
          {
            pending: "Creating Repository...",
            success: "Repository Created.",
            error: "Error creating repository."
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
                    <label className="text-sm font-medium text-gray-700">Viewers</label>
                    <TagsInput
                        value={formData.viewers}
                        onChange={handleViewers}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Contributors</label>
                    <TagsInput
                        value={formData.contributors}
                        onChange={handleContributors}
                    />
                </div>
                <ActionButton text
                ="Create Repository" onClick={createRepository} />
            </div>
        </ModalLayout>
    )
}
