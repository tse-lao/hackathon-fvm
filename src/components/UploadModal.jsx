
import MatchRecord from '@/hooks/useBlockchain';
import { fetchWithRetry, readJWT, uploadCarFile } from '@/hooks/useLighthouse';
import { getLighthouse, uploadMetaData } from '@/lib/createLighthouseApi';
import { getMetadataFromFile } from '@/lib/dataHelper';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import lighthouse from '@lighthouse-web3/sdk';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import ModalLayout from "./ModalLayout";
import Toggle from './application/Toggle';
import { ActionButton } from './application/elements/buttons/ActionButton';
import LoadingIcon from './application/elements/loading/LoadingIcon';
uploadMetaData

export default function UploadModal({ onClose, open }) {
    const [files, setFiles] = useState([])
    const [encryption, setEncryption] = useState(true)
    const { address } = useAccount();
    const [loading, setLoading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState("")
    const [uploadedProgress, setUploadedProgress] = useState(0);
    const uploadedFiles = [];



    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData.total / progressData.uploaded).toFixed(2);
        console.log(percentageDone);
    };

    const upload = async (e) => {
        const tempFiles = [...files]
        for (let i = 0; i < e.target.files.length; i++) {
            tempFiles.push(e.target.files[i])
        }
        setFiles(tempFiles);
    }


    const startUpload = async () => {
        if (encryption) {
            const encryptedUploadResult = await uploadFileEncrypted();
            console.log(encryptedUploadResult)
        } else {
            const result = await uploadFile();
            console.log(result)
        }

    }

    const uploadFile = async () => {
        setLoading(true);
        const apiKey = await getLighthouse(address);
        const authToken = await lighthouse.dataDepotAuth(apiKey);

        let list = [];
        for (let i = 0; i < files.length; i++) {
            const mockEvent = {
                target: {
                    files: [files[i]],
                },
                persist: () => { },
            };


            let cid = "";
            try {
                const output = await lighthouse.upload(mockEvent, apiKey, progressCallback);
                cid = output.data.Hash
            } catch (e) {
                console.log(e)
            }

            let metadata = "";

            if (mockEvent.target.files[i].type == "application/json") {
                metadata = await getMetadataFromFile(mockEvent.target);
            }


            const file = {
                name: mockEvent.target.files[0].name,
                type: mockEvent.target.files[0].type,
                size: mockEvent.target.files[0].size,
                cid: cid,
                metadata: metadata,
            };

            list.push(file);
        }

        await uploadCarFile(files, progressCallback, authToken.data.access_token)

        await sleep(1000);
        //time
        await MatchRecord(list, authToken.data.access_token)

        setLoading(false)
        onClose()

    }



    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const uploadFileEncrypted = async () => {
        setLoading(true)

        setUploadStatus("Gathering Authentication");

        console.log(address);
        let api = await getLighthouse(address);
        const jwt = await readJWT(address);
        setUploadStatus("Uploading files to lighthouse drive.");

        let list = [];
        for (let i = 0; i < files.length; i++) {

            const mockEvent = {
                target: {
                    files: [files[i]],
                },
                persist: () => { },
            };
            let cid = "";
            let metadata = "";

            try {
                const encryptedResult = await lighthouse.uploadEncrypted(
                    mockEvent,
                    api,
                    address,
                    jwt
                );


                cid = encryptedResult.data.Hash;


            } catch (e) { toast.error(e.message) }

            if (mockEvent.target.files[0].type === "application/json") {
                metadata = await getMetadataFromFile(mockEvent.target);
            }
            const file = {
                name: mockEvent.target.files[0].name,
                type: mockEvent.target.files[0].type,
                size: mockEvent.target.files[0].size,
                cid: cid,
                metadata: metadata,
            };

            list.push(file);
        }


        let dataDepo = []

        console.log(dataDepo)

        setUploadStatus("Gathering encrypted files for storage.");

        console.log(list);
        for (let i = 0; i < list.length; i++) {
            //change the blob of each file element with the blob of the encrypted file.
            let cid = list[i].cid;

            //get the blob of the encrypted file

            let endpoint = `https://gateway.lighthouse.storage/ipfs/${cid}`;
            let blob = await fetchWithRetry(endpoint, 1000, 5);

            const file = new File([blob], cid, { type: list[i].type });
            dataDepo.push(file)
        }
        console.log(dataDepo)


        setUploadStatus("Getting access control for data depo.");

        const authToken = await lighthouse.dataDepotAuth(api);
        console.log(authToken.data.access_token)

        setUploadStatus("Storing files in data depo.");
        const result = await uploadCarFile(dataDepo, progressCallback, authToken.data.access_token);
        console.log(result)
        await sleep(1000);
        setUploadStatus("Matching files and storing both files in Polybase.");
        await MatchRecord(list, authToken.data.access_token)


        setLoading(false)

        onClose();
    }


    const changeStatus = (status) => {
        setEncryption(status)
    }

    const removeSelect = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    }


    return (
        <ModalLayout onClose={onClose} title="Upload Files">
            {loading ? (
                <div className='mt-2'>
                    <div className="flex justify-center text-center flex-col gap-6 py-6">
                        <LoadingIcon height={64} />
                        <span className='text-lg font-md text-gray-500'>
                            {uploadStatus}
                        </span>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="py-4 sm:gap-4 sm:py-5">
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-800 max-h-[400px] overflow-auto">
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
                                <li className="flex items-center justify-between py-2 pl-2 pr-4 text-sm bg-white dark:bg-gray hover:bg-cf-200">
                                    <span className="ml-2 w-0 flex-1 truncate ">
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            multiple
                                            accept="*"
                                            onChange={e => upload(e)}
                                            className="shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </span>
                                </li>
                            </ul>
                        </dd>


                    </div>

                    <Toggle text="Encrypt file" status={encryption} changeStatus={changeStatus} />
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-4">
                        <ActionButton text={`Upload [${files.length}] files`} onClick={startUpload}
                        />
                    </div>
                </div>
            )}


        </ModalLayout>
    )
}
