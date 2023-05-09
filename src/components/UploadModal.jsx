import { getLighthouse, signAuthMessage } from '@/lib/createLighthouseApi';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import lighthouse from '@lighthouse-web3/sdk';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import ModalLayout from "./ModalLayout";
import Toggle from './application/Toggle';


export default function UploadModal({ onClose }) {
    const [files, setFiles] = useState([])
    const [encryption, setEncryption] = useState(true)
    const { address } = useAccount();

    const uploadedFiles = [];

    useEffect(() => {
        console.log(files)
    }, [files])

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
    };



    const upload = async (e) => {
        const tempFiles = files
        for (let i = 0; i < e.target.files.length; i++) {
            tempFiles.push(e.target.files[i])
        }

        setFiles(tempFiles)

        console.log(files)

    }

    const uploadFile = async (e) => {

        let api = await getLighthouse(address);
        const output = await lighthouse.upload(e, api, progressCallback);

        console.log(output)
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
        const sig = await signAuthMessage();
        const response = await lighthouse.uploadEncrypted(
            e,
            api,
            sig.publicKey,
            sig.signedMessage,

            progressCallback
        );

    }

    const changeStatus = (status) => {
        setEncryption(status)
    }

    const removeSelect = (index) => {
        toast.success("File removed" + index);
        const tempFiles = files
        tempFiles.splice(index, 1)
        setFiles(tempFiles)

    }


    return (
        <ModalLayout onClose={onClose}>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">

                    <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                        <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm bg-white dark:bg-gray">
                            
                            <span className="ml-2 w-0 flex-1 truncate">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    multiple
                                    accept="application/json, application/csv"
                                    onChange={e => upload(e)}
                                    className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </span>


                        </li>


                        {files.map((file, index) => (
                            <li key={file.name} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm bg-white dark:bg-gray">
                                <div className="flex w-0 flex-1 items-center">
                                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                    <span className="ml-2 w-0 flex-1 truncate">{file.name}</span>
                                </div>
                                <div className="ml-4 flex flex-shrink-0 space-x-4">
                                    <button
                                        type="button"
                                        onClick={e => { removeSelect(index) }}

                                        className="rounded-md bg-white font-medium text-indigo-600 hover:text-red-500 "
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}


                    </ul>
                </dd>


            </div>

            <Toggle text="Encrypt file" status={encryption} changeStatus={changeStatus} />
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-4">
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-cf-500 text-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-cf-600 hover:bg-cf-300 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                >
                    Upload
                </button>

                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </ModalLayout>
    )
}
