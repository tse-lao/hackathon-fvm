import { useContract } from "@/hooks/useContract";
import useNftStorage from "@/hooks/useNftStorage";
import { analyzeJSONStructure, readJSONFromFileInput } from "@/lib/dataHelper";
import lighthouse from "@lighthouse-web3/sdk";
import { useState } from "react";
import 'react-tagsinput/react-tagsinput.css';
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import ModalLayout from "../ModalLayout";
import LoadingSpinner from "../application/elements/LoadingSpinner";
import InputField from "../application/elements/input/InputField";
import TextArea from "../application/elements/input/TextArea";

export default function CreateJob({ onClose, changeOpen, getOpen, dataFormat }) {
    const { address } = useAccount();
    const { createJob } = useContract();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        spec_start: "",
        spec_end: "",
        numOfInputs: 0,
        categories: [],
        metadata: "no_metadata",
    });
    const [loadingFile, setLoadingFile] = useState(false);
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [file, setFile] = useState(null);
    const [metadata, setMetadata] = useState(dataFormat);

    const { uploadMetadata } = useNftStorage();



    const uploadMeta = async (e) => {
        setLoadingMeta(true);

        const file = e.target.files[0];
        if (!file) {
            toast.error("No file selected");
            return;
        }
        readJSONFromFileInput(e.target, async (error, jsonData) => {
            if (error) {
                console.error(error);
            } else {
                const format = analyzeJSONStructure(jsonData);
                const cid = await uploadMetadata(JSON.stringify(format));
                setMetadata(cid);
                setLoadingMeta(false);
            }
        });
    }
    
    const uploadFile = async (e) => {
        const apiKey = getLighthouse(address);
        setLoadingFile(true)
        const file = e.target.files[0];
        let upload = await lighthouse.upload(file, apiKey);
        if(upload.data.Hash){
            setFile(upload.data.Hash)
        }
        
        setLoadingFile(false)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(formData.description.length > 1024){
            toast.error("Cannot exceed the 1024 characters")
            return;
        }
        
        
        //(name: string, description: string, dataFormat: string, startCommand: string, endCommand: string, numberOfInputs: number, creator: string)
        toast.promise(createJob(
            formData.name, 
            formData.description, 
            formData.metadata,
            formData.spec_start, 
            formData.spec_end, 
            formData.numOfInputs, 
            address
            ), {
            pending: `We are uploading your submission ${formData.name} to the contract. `, 
            success: `Succesfully added the following job ${formData.name}`, 
            error: `Failed to create the job ${formData.name}`
        }).then((result) => {
            console.log(result)
            if(result.status === "success"){
                onClose();
            }
        })
    };



    return (
        <ModalLayout title="Create Job" onClose={onClose} getOpen={getOpen} changeOpen={changeOpen}>
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
                    label="Description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
                {file ? (
                    <div className="items-center">
                    cid: 
                        <a href={`https://gateway.lighthouse.storage/ipfs/${metadata}`}
                            className="text-cf-600 hover:text-cf-500"
                        >{file}</a>
                    </div>

                ) : (
                    loadingFile ? <LoadingSpinner loadingText='uploading file' /> :
                        <div>
                            <label htmlFor="requestData" className="block text-md mb-2 font-medium text-gray-700">
                                Upload Program
                            </label>
                            <input
                                type="file"
                                name="metadata" id="metadata" onChange={uploadFile} required
                                accept="*"
                            />
                        </div>
                )}
                <TextArea
                    label="Spec Start"
                    name="spec_start"
                    rows={2}
                    value={formData.spec_start}
                    onChange={handleChange}
                    required
                />
                <TextArea
                    label="Spec End"
                    name="spec_end"
                    rows={2}
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
                
                {metadata ? (
                    <div className="items-center">
                        <a href={`https://gateway.ipfs.io/ipfs/${metadata}`}
                            className="text-cf-600 hover:text-cf-500"
                        >Preview metadata</a>
                    </div>

                ) : (
                    loadingMeta ? <LoadingSpinner loadingText='uploading metadata' /> :
                        <div>
                            <label htmlFor="requestData" className="block text-md mb-2 font-medium text-gray-700">
                                Upload metadat
                            </label>
                            <input
                                type="file"
                                name="metadata" id="metadata" onChange={uploadMeta} required
                                accept="application/json, application/csv"
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
        </ModalLayout>
    );
};
