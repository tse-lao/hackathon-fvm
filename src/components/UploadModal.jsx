
import { createJWTToken, uploadCarFile } from '@/hooks/useLighthouse';
import { getLighthouse, uploadMetaData } from '@/lib/createLighthouseApi';
import { getMetadataFromFile } from '@/lib/dataHelper';
import { PaperClipIcon } from '@heroicons/react/24/outline';
import lighthouse from '@lighthouse-web3/sdk';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import ModalLayout from "./ModalLayout";
import Toggle from './application/Toggle';
import LoadingSpinner from './application/elements/LoadingSpinner';
uploadMetaData

export default function UploadModal({ onClose }) {
    const [files, setFiles] = useState([])
    const [encryption, setEncryption] = useState(true)
    const { address } = useAccount();
    const [loading, setLoading] = useState(false)

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
        console.log(list);
        const uploadCar = await uploadCarFile(files, progressCallback, authToken.data.access_token)

        const response = await fetch('/api/polybase/file_upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list, accessToken: authToken.data.access_token  }),
          });
      
          const result = await response.json();
          console.log(result)
          
          setLoading(false)
        console.log(uploadCar)
        window.location.reload();

    }


    const uploadFileEncrypted = async () => {
        setLoading(true)
        let api = await getLighthouse(address);
        const jwt = await createJWTToken(address);


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
                // window.location.reload();


            } catch (e) {   toast.error(e.message)}

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
        for(let i = 0; i < list.length; i++){
        //change the blob of each file element with the blob of the encrypted file.
            let cid = list[i].cid;
            let endpoint = `https://gateway.lighthouse.storage/ipfs/${cid}`;
            let blob = await fetch(endpoint).then(r => r.blob());
        
            const file = new File([blob], cid, { type: list[i].type });
            dataDepo.push(file)
        }    
        console.log(dataDepo)
        

        const authToken = await lighthouse.dataDepotAuth(api);
        console.log(authToken.data.access_token)
        
        //here we somehow need to create a new file from the encrypted file and upload it. 
        const uploadCar = await uploadCarFile(dataDepo, progressCallback, authToken.data.access_token);
        
         const response = await fetch('/api/polybase/file_upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list, accessToken: authToken.data.access_token }),
          }); 
      
          const result = await response.json();
          console.log(result)
        
          setLoading(false)
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
    {loading ? <LoadingSpinner msg="Uploading files.. " />: (
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
            <button
                type="button"
                className=" mt-3 inline-flex w-full justify-center rounded-md bg-cf-500 text-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-cf-600 hover:bg-cf-300 sm:mt-0 sm:w-auto"
                onClick={startUpload}
            >
                Upload [{files.length}] files
            </button>
            </div>
            </div>
            )}

        
    </ModalLayout>
)
}
