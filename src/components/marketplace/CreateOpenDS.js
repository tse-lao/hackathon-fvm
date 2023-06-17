
import MatchRecord from '@/hooks/useBlockchain';
import { useContract } from '@/hooks/useContract';
import { getDataDepoAuth } from '@/hooks/useLighthouse';
import { getLighthouse } from '@/lib/createLighthouseApi';
import { getMetadataFromFile } from '@/lib/dataHelper';
import { matchAndSetCarFile, uploadAndSetFile, uploadFileWithProgress } from '@/lib/uploadHelpers';
import lighthouse from '@lighthouse-web3/sdk';
import { useState } from 'react';
import TagsInput from 'react-tagsinput';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import ModalLayout from '../ModalLayout';
import LoadingSpinner from '../application/elements/LoadingSpinner';
import { ActionButton } from '../application/elements/buttons/ActionButton';
import InputField from "../application/elements/input/InputField";
import TextArea from '../application/elements/input/TextArea';


export default function CreateOpenDS({ tokenId, openModal, onClose }) {
    const { address } = useAccount();
    const { createOpenDataSet } = useContract();
    const [formData, setFormData] = useState({
        name: "",
        categories: [],
        description: "",
        metadata: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingFile, setLoadingFile] = useState(false);
    const [file, setFile] = useState({
        name: "",
        type: "",
        size: "",
        cid: "",
        metadata: "",

    });
    const [carError, setCarError] = useState(false);


    const uploadFile = async (e) => {
        setLoadingFile(true);
        const apiKey = await getLighthouse(address);
        const authToken = await getDataDepoAuth(address);
        const uploadFile = e.target.files[0];
        const mockEvent = { target: { files: [uploadFile] }, persist: () => { } };

        try {
            const dummyFile = await uploadAndSetFile(mockEvent, apiKey, progressCallback);
            console.log("DUMMY FILE")
            console.log(dummyFile);

            //get metadata

            setFile(dummyFile);
            await uploadFileWithProgress(uploadFile, progressCallback, authToken.data.access_token);
            await sleep(3000);
            await matchAndSetCarFile(dummyFile, authToken.data.access_token, setLoadingFile, setFile, setCarError);

            console.log(mockEvent.target.files[0].type)
            if (mockEvent.target.files[0].type === "application/json") {
                let tempMeta = await getMetadataFromFile(mockEvent.target);

                console.log(tempMeta);

                setFormData({ ...formData, metadata: tempMeta });

            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
        setLoadingFile(false);
    };

    async function matchCarFile(dummy) {
        const apiKey = await getLighthouse(address);
        const authToken = await lighthouse.dataDepotAuth(apiKey);
        setCarError(false)
        try {
            const result = await MatchRecord([dummy], authToken.data.access_token, true)
            console.log(result);


            setFile(
                {
                    ...dummy,
                    ...result.data[0].data
                }
            )
        } catch (e) {
            console.log(e)
            setCarError(true)
            setLoadingFile(false)
        }
    }



    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData.total / progressData.uploaded).toFixed(2);
        console.log(percentageDone);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleTagChange = (tags) => {
        setFormData({ ...formData, categories: tags });
    };

    const submitOpen = async () => {

        //apply control for every address with blance 

        if (formData.description.length < 10 || formData.description.length > 1000) {
            toast.error("Your description needs to be between 10 and 1000 characters")
        }
        setLoading(true)
        console.log(file);
        const contract = await createOpenDataSet(
            file.cid,
            file.carRecord.pieceCid,
            formData.metadata,
            formData.name,
            formData.description,
            formData.categories,
            file.type,
        )

        console.log(contract);
        setLoading(false)
    }

    if (loading) {
        return <LoadingSpinner />
    }
    return (
        <ModalLayout title="Create Open Dataset" open={openModal} onClose={onClose}>
            <div className="space-y-4 w-full">
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
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <TagsInput value={formData.categories} onChange={handleTagChange} />
                </div>

                {loadingFile ? <LoadingSpinner /> :
                    !file.cid ? (
                        <div>
                            <label htmlFor="upload" className="block text-sm font-medium text-gray-700">
                                Upload Opendataset
                            </label>
                            <input
                                type="file"
                                name="job" id="job" onChange={uploadFile} required
                                accept="application/json"
                            />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Your open dataset
                            </label>
                            <span className="text-sm">{file.cid} || {file.pieceCid} || {file.metadata}</span>
                        </div>
                    )}

                {carError ? <ActionButton loading={loading} text="Find Car" onClick={() => matchCarFile(file)} /> : <ActionButton text="Create Open Dataset" onClick={submitOpen} />}




            </div>

        </ModalLayout>
    )
}