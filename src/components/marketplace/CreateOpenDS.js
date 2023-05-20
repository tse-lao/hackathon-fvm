import MatchRecord from '@/hooks/useBlockchain';
import { useContract } from '@/hooks/useContract';
import { uploadCarFile } from '@/hooks/useLighthouse';
import { getLighthouse } from '@/lib/createLighthouseApi';
import { getMetadataFromFile } from '@/lib/dataHelper';
import lighthouse from '@lighthouse-web3/sdk';
import { useState } from 'react';
import TagsInput from 'react-tagsinput';
import { useAccount } from 'wagmi';
import ModalLayout from '../ModalLayout';
export default function CreateOpenDS({ tokenId, onClose }) {
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
    const [file, setFile] = useState(null);

    const uploadFile = async (e) => {

        setLoading(true);
        const apiKey = await getLighthouse(address);
        const authToken = await lighthouse.dataDepotAuth(apiKey);
        
        const mockEvent = {
            target: {
                files: [e.target.files[0]],
            },
            persist: () => { },
        };

        let cid = "";
        try {
            const output = await lighthouse.upload(e, apiKey, progressCallback);
            console.log(output)
            cid = output.data.Hash
        } catch (e) {
            console.log(e)
        }

        let metadata = "";
        

        

        if (e.target.files[0].type == "application/json") {
            metadata = await getMetadataFromFile(mockEvent.target);
        }


        const dummyFile = {
            name: e.target.files[0].name,
            type: e.target.files[0].type,
            size: e.target.files[0].size,
            cid: cid,
            metadata: metadata,
        };
        
        setFile(dummyFile)

        await uploadCarFile(e.target.files[0], progressCallback, authToken.data.access_token)
        
        await sleep(1000);
        //get car file. 
        const result = await MatchRecord([dummyFile], authToken.data.access_token, true)
        
        console.log(result);
        
        setFile(
            {
                ...dummyFile,
                pieceCid: result.data.data[0].carPieceCid,
                carPayload: result.data.data[0].carPayload,
            }
        )
        
        console.log(dummyFile)

        setLoading(false)

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
    setLoading(true)
console.log(file);
    const contract = await createOpenDataSet(
        file.cid,
        file.carRecord.pieceCid,
        file.metadata,
        formData.name,
        formData.description,
        formData.categories,
    )

    console.log(contract);
    setLoading(false)
}

return (
    <ModalLayout title="Create Open Dataset" onClose={onClose}>
        <div className="space-y-4 w-full">
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
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
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
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <TagsInput value={formData.categories} onChange={handleTagChange} />
            </div>

            {loadingFile ? <LoadingSpinner /> :
                !file ? (
                    <div>
                        <label htmlFor="upload" className="block text-sm font-medium text-gray-700">
                            Upload Opendataset
                        </label>
                        <input
                            type="file"
                            name="job" id="job" onChange={uploadFile} required
                            accept="*"
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

            <button
            onClick={submitOpen}
                type="button"
                className="bg-indigo-500 hover:bg-indigo-700 self-end text-white font-bold py-2 px-4 rounded-full"
            >
                Create Dataset
            </button>




        </div>

    </ModalLayout>
)
}
