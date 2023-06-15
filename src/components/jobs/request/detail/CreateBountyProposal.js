
import LoadingSpinner from '@/components/application/elements/LoadingSpinner';
import InputField from '@/components/application/elements/input/InputField';
import TextArea from '@/components/application/elements/input/TextArea';
import { getLighthouse } from '@/hooks/useLighthouse';
import { submitProposal } from '@/hooks/usePolybase';
import lighthouse from "@lighthouse-web3/sdk";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

export default function CreateBountyProposal({bountyID}) {
    const [loadingFile, setLoadingFile] = useState(false);
    const {address} = useAccount();
;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        spec_start: "",
        spec_end: "",
        numOfInputs: 0,
    });
    const [file, setFile] = useState("");
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const uploadFile = async (e) => {
        setLoadingFile(true);
        const file = e.target.files[0];
        if (!file) {
            toast.error("No file selected");
            return;
        }
        
        const api = await getLighthouse(address);


        
        //upload cid 
        const mockEvent = {
            target: e.target,
            persist: () => { },
        };
        try {
            const result = await lighthouse.upload(mockEvent, api);
            console.log(result.data.Hash);
            setFile(result.data.Hash);
        }catch (e) {
            console.log(e);
        }
        
        setLoadingFile(false);
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if(formData.name.length < 3 ||formData.spec_start.length < 3 || formData.spec_end.length < 3 || formData.description.length < 3) {
            toast.error("Please fill out all fields");
            return;
        }
        
        toast.promise(submitProposal(
            bountyID,
            formData.name,
            formData.description,
            file, 
            formData.spec_start, 
            formData.spec_end,
            parseInt(formData.numOfInputs), 
            address
        ), {
            pending: 'Submitting proposal...',
            success: 'Proposal submitted!',
            error: 'Error submitting proposal'
        })
        
    }
        
    
    
    return (
            <div className="space-y-4">
                <InputField
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextArea
                    label="Instuctions"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                <TextArea
                    label="Spec Start"
                    name="spec_start"
                    rows={2}
                    value={formData.spec_start}
                    onChange={handleChange}
                    code={true}
                    required
                />
                <TextArea
                    label="Spec End"
                    name="spec_end"
                    rows={2}
                    code={true}
                    value={formData.spec_end}
                    onChange={handleChange}
                    required
                />

                <InputField
                    label="Number of Inputs"
                    name="numOfInputs"
                    type="number"
                    value={formData.numOfInputs}
                    onChange={handleChange}
                    required
                />


                {file ? (
                    <div className="items-center">
                        <a href={`https://gateway.lighthouse.storage/ipfs/${file}`}
                            className="text-cf-600 hover:text-cf-500"
                        >Preview file</a>

                    </div>

                ) : (
                    loadingFile ? <LoadingSpinner loadingText='uploading file..' /> :
                        <div>
                            <label htmlFor="requestData" className="block text-md mb-2 font-medium text-gray-700">
                                Upload program
                            </label>
                            <input
                                type="file"
                                name="file" id="file" onChange={uploadFile} required  
                            />
                        </div>
                )}
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cf-600 hover:bg-cf-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cf-500"
                >
                    Submit
                </button>
            </div>


    )
}
