import { useContract } from '@/hooks/useContract';
import { uploadCarFileFromCid } from '@/hooks/useLighthouse';
import { getSignature, retrieveMergeCID } from '@/hooks/useLitProtocol';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

import { TextField } from '@/components/Fields';
import ModalLayout from '@/components/ModalLayout';
import LoadingIcon from '../elements/loading/LoadingIcon';

export default function CreateDataSetProposal({ tokenId, creator, onClose }) {
    const { address } = useAccount();
    const [splitterContract, setSplitterContract] = useState(null);
    const [mergedCID, setMergedCID] = useState(null);
    const [mintPrice, setMintPrice] = useState(0.001);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "", 
        description: ""
    })

    const router = useRouter();
    const { multisigCreateDatabaseProposal } = useContract();
    const [payload, setPayload] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const mergeCID = async () => {
        setLoading(true);
        try {
            const result = await retrieveMergeCID(tokenId, address);
            console.log(result)
            
            const uploadCarFile = await uploadCarFileFromCid(result, address);
            console.log(uploadCarFile[0].data);
            
            setPayload(uploadCarFile[0].data.cidHex);
            
            //let see if we can get back the payload. 
            setMergedCID(result);
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    const mintNFT = async () => {
        setLoading(true);
        //Getting splitter and create the spliitter contract.
        const price = ethers.utils.parseEther(mintPrice.toString())
        const toSign = tokenId.concat("", mergedCID).concat("", price).concat("", splitterContract);
        const sign = await getSignature(toSign);

        
        if(formData.name.length < 3 || formData.description.length < 5){
            toast.error("make sure you have a proposal name and description")
        }
        
        toast.promise(multisigCreateDatabaseProposal(
            creator, 
            formData.name, 
            formData.description, 
            tokenID, 
            mergedCID, 
            mintPrice, 
            payload, 
            ),{
            pending: 'Preparing Database into NFT',
            success: 'Database ready for minting, enjoy the rewards!',
            error: 'Oops, something went wrong.'
        }).then(() => {
            setLoading(false);
            onClose();
            router.push(`/market/${tokenId}`);
        })
        //console.log(result);s
       
        

    }
    return (
        <ModalLayout title="Generate Dataset" onClose={onClose}>
            <div className='flex flex-col gap-7'>
                <span className='text-gray-600'>
                    Welcome you have received enough collections to start minting your new database.
                    Please follow the steps below in order to mint your new data.
                </span>

                <div className='flex flex-col mt-4 gap-4'>
                    <h2 className='text-xl font-bold text-gray-800 '>
                        Proposal
                    </h2>
                    {splitterContract ? (
                        <div>
                            <h2>{formData.name}</h2>
                            <span>{formData.description}</span>
                        </div>
                    ) : 
                        loading ? (
                            <LoadingIcon height={64}/>
                        ):(
                        <div className='flex flex-col gap-2'>
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
                            <button
                                className='bg-cf-500 hover:bg-cf-700 text-white font-bold py-2 px-4 rounded'
                                onClick={setSplitterContract(true)}
                            >Contine</button>

                        </div>

                    )}
                </div>

                <div className='flex flex-col'>
                    <h2 className='text-xl font-bold text-gray-800 mb-2'>
                        Merged CID
                    </h2>
                    {mergedCID ? (
                        <span>
                            {mergedCID}
                            
                            Payload: {payload}
                        </span>
                    ) :
                        splitterContract && 
                            loading ?<LoadingIcon  height={64} /> : (
                            <div className='flex flex-col gap-2'>
                                <span className='text-sm text-gray-600'>
                                    We will be merging the CID of the contributors in order to create a new CID that will be used to mint the NFT.
                                </span>
                                <button
                                    className='bg-cf-500 hover:bg-cf-700 text-white font-bold py-2 px-4 rounded'
                                    onClick={mergeCID}
                                >Merge CIDs</button>
                            </div>
                        ) }


                </div>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-xl font-bold text-gray-800'>
                        Create NFT
                    </h2>
                    {mergedCID && splitterContract && (
                        <div className='flex flex-col gap-2'>
                        { loading &&  <LoadingIcon  height={64} /> }
                            <span>
                                Now we have everything prepared for the minting of the NFT, please set a price for the NFT and starting preparing the dataset for distribution
                            </span>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Minting Price in ethers.
                                </label>
                                <input
                                    type="number"
                                    name="minRows"
                                    id="minRows"
                                    value={mintPrice}
                                    onChange={(e) => setMintPrice(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                onClick={mintNFT}
                            >Create Dataset</button>
                        </div>

                    )}

                </div>
            </div>
        </ModalLayout>
    )
}
