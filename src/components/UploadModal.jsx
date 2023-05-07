import { getLighthouse } from '@/lib/createLighthouseApi';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import ModalLayout from "./ModalLayout";
import Toggle from './application/Toggle';


export default function UploadModal({ onClose }) {
    const [files, setFiles] = useState([])
    const [encryption, setEncryption] = useState(false)
    const { address } = useAccount();


    const encryptionSignature = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(address);
        const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
        const signedMessage = await signer.signMessage(messageRequested);
        return ({
            signedMessage: signedMessage,
            publicKey: address
        });
    }

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
    };

    /* Deploy file along with encryption */

    const upload = async (e) => {

        if (encryption) {
            uploadFileEncrypted(e)
        }else{
            uploadFile(e)
        }


    }

    const uploadFile = async (e) => {

        let api = await getLighthouse(address);
        const output = await lighthouse.upload(e, api, progressCallback);
        console.log('File Status:', output);
        setFiles(e.target.files)
    }
    const uploadFileEncrypted = async (e) => {
        /*
           uploadEncrypted(e, accessToken, publicKey, signedMessage, uploadProgressCallback)
           - e: js event
           - accessToken: your API key
           - publicKey: wallets public key
           - signedMessage: message signed by the owner of publicKey
           - uploadProgressCallback: function to get progress (optional)
                

        */
           let api = await getLighthouse(address);
           console.log(api);
            const sig = await encryptionSignature();
            const response = await lighthouse.uploadEncrypted(
            e,
            api,
            sig.publicKey,
            sig.signedMessage,
            progressCallback
        );
        console.log(response);

        setFiles(e.target.files)

    }

    const changeStatus = (status) => {
        setEncryption(status)
    }


    return (
        <ModalLayout onClose={onClose}>
            <Toggle text="Encrypt file" status={encryption} changeStatus={changeStatus} />
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm bg-white dark:bg-gray">
                            <div className="flex w-0 flex-1 items-center">
                                <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                <span className="ml-2 w-0 flex-1 truncate">
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        multiple
                                        accept="application/json, application/csv"
                                        onChange={e => upload(e)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </span>
                            </div>
                        </li>
                        {Array.from(files).map(file => (
                            <li key={file.name} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm bg-white dark:bg-gray">
                                <div className="flex w-0 flex-1 items-center">
                                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                    <span className="ml-2 w-0 flex-1 truncate">{file.name}</span>
                                </div>
                                <div className="ml-4 flex flex-shrink-0 space-x-4">
                                    <button
                                        type="button"
                                        onClick={console.log("download")}
                                        className="rounded-md bg-white font-medium text-indigo-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}


                    </ul>
                </dd>
            </div>

            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">

                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </ModalLayout>
    )
}
