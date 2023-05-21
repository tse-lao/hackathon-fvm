import { useContract } from '@/hooks/useContract';
import { getSignature, retrieveMergeCID } from '@/hooks/useLitProtocol';
import { getContributionSplit } from '@/hooks/useTableland';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import ModalLayout from '../ModalLayout';
import LoadingIcon from '../application/elements/loading/LoadingIcon';

export default function GenerateDataset({ tokenId, onClose }) {
    const { address } = useAccount();
    const [splitterContract, setSplitterContract] = useState(null);
    const [mergedCID, setMergedCID] = useState(null);
    const [mintPrice, setMintPrice] = useState(0.001);
    const [loading, setLoading] = useState(false);
    const { CreateSpitter, createDB_NFT } = useContract();

    async function createSplitterContract() {
        setLoading(true);
        const contributors = await getContributionSplit(tokenId);
        try {
            const hash = await CreateSpitter(address, contributors.contributors, contributors.percentage);
            console.log(hash);

            let contract = hash.events[0].data.replace("0x000000000000000000000000", "0x");
            console.log(contract);
            
            setSplitterContract(contract);

        } catch (e) {
            console.log(e);
        }
        
        setLoading(false);

    }

    const mergeCID = async () => {
        setLoading(true);
        try {
            const result = await retrieveMergeCID(tokenId, address);
            console.log(result)
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

        try {
            await createDB_NFT(tokenId, mergedCID, mintPrice, splitterContract, sign.v, sign.r, sign.s)
            window.location.realod()
        }
        catch (e) {
            console.log(e)
        }
        //console.log(result);s
        setLoading(false);
        onClose();
        

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
                        Splitter Contract
                    </h2>
                    {splitterContract ? (
                        <Link href={`https://mumbai.polygonscan.com/address/${splitterContract}`} className='text-cf-600 hover: text-cf-800'>
                            {splitterContract}
                        </Link>
                    ) : 
                        loading ? (
                            <LoadingIcon height={64}/>
                        ):(
                        <div className='flex flex-col gap-2'>
                            <span className='text-gray-600'>
                                First we need to create a splitter contract, where all the contributors will be able to collect rewards upon minting the NFT.
                                If people are minting the NFT they will be rewarded with a fair percentage over the total contribution.


                            </span>
                            <button
                                className='bg-cf-500 hover:bg-cf-700 text-white font-bold py-2 px-4 rounded'
                                onClick={createSplitterContract}
                            >Create Splitter</button>

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
