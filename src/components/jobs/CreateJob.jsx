import useNftStorage from "@/hooks/useNftStorage";
import { getLighthouse } from "@/lib/createLighthouseApi";
import { analyzeJSONStructure, readJSONFromFileInput } from "@/lib/dataHelper";
import lighthouse from "@lighthouse-web3/sdk";
import { usePolybase } from "@polybase/react";
import { useState } from "react";
import TagsInput from "react-tagsinput";
import 'react-tagsinput/react-tagsinput.css';
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';
import { useAccount } from "wagmi";
import LoadingSpinner from "../application/elements/LoadingSpinner";
import CreateOverlay from "../application/overlay/CreateOverlay";


export default function CreateJob({ onClose, changeOpen, getOpen, dataFormat }) {
    const { address } = useAccount();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categories: [],
        metadata: dataFormat,
    });
    const [loadingFile, setLoadingFile] = useState(false);
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [jobCid, SetJobCid] = useState(null);
    const [metadata, setMetadata] = useState(dataFormat);

    const polybase = usePolybase();
    const { uploadMetadata } = useNftStorage();
    
    console.log("METADATa", dataFormat)

    const handleTagChange = (tags) => {
        setFormData({ ...formData, categories: tags });
    };

    const uploadJob = async (e) => {
        setLoadingFile(true);

        const file = e.target.files[0];

        if (!file) {
            toast.error("No file selected");
            return;
        }
        //upload to ipfs
        const api = await getLighthouse(address)

        try {

            const cid = await lighthouse.upload(e, api);
            console.log(cid);

            SetJobCid(cid.data.Hash);

        } catch (e) {
            console.log(e);
        }


        setLoadingFile(false);
    }

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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Process the form data and send it to the server or API endpoint.
        console.log(formData);

        //prepping the data to collect here. 

        if (!jobCid) {
            toast.error("No job file uploaded");
            return;
        }
        if (!metadata) {
            toast.error("No metadata uploaded");
            return;
        }

        console.log(formData);

        const result = await createJob(formData.name, formData.description, jobCid, metadata, formData.categories, address);

        console.log(result);
    };

    async function createJob(name, description, jobCid, dataformat, categories, owner) {
        const updatedAt = new Date().toISOString();
        const newId = uuidv4();


        return new Promise(async (resolve, reject) => {
            try {
                const collection = await polybase.collection("Jobs").create([
                    newId,
                    name,
                    description,
                    jobCid,
                    dataformat,
                    categories,
                    updatedAt,
                    owner
                ])

                resolve(collection)
            } catch (error) {
                reject(error)
            }

        });

        //id, name, description, jobCid, datafromat, categories, createdAt, owner
    }


    return (
        <CreateOverlay title="Create Job" onClose={onClose} getOpen={getOpen} changeOpen={changeOpen}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-cf-500 focus:border-cf-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <TagsInput value={formData.categories} onChange={handleTagChange} />
                </div>

                {loadingFile ? <LoadingSpinner loadingText='uploading metadata' /> :
                    !jobCid ? (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Upload JOB File (turn into CID)
                            </label>
                            <input
                                type="file"
                                name="job" id="job" onChange={uploadJob} required
                                accept="*"
                            />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Your Job Cid
                            </label>
                            <span className="text-sm">{jobCid}</span>
                        </div>
                    )}



                <div>
                    <label htmlFor="requestData" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-cf-500 focus:border-cf-500 sm:text-sm"
                    ></textarea>
                </div>
                
                    
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
                                Upload to analyze metadata
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
        </CreateOverlay>
    );
};
