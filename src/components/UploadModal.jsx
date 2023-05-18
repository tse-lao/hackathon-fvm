
import { uploadCarFile } from '@/hooks/useLighthouse';
import { getLighthouse, signAuthMessage } from '@/lib/createLighthouseApi';
import { readFSStream } from '@/lib/dataHelper';
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

    const [uploadedProgress, setUploadedProgress] = useState(0);
    const uploadedFiles = [];

    useEffect(() => {
    }, [])

    const progressCallback = (progressData) => {
        let percentageDone =
            100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
        console.log(percentageDone);
    };



    const upload = async (e) => {
              
        const apiKey = await getLighthouse(address);
        const authToken = await lighthouse.dataDepotAuth(apiKey)
        
        console.log(e.target.files);
        
        
        const tempFiles = [...files]
        for (let i = 0; i < e.target.files.length; i++) {
            tempFiles.push(e.target.files[i])
        }
        console.log(tempFiles)
        const upload = await uploadCarFile(tempFiles, progressCallback, authToken.data.access_token)

        setFiles(tempFiles);
    
    }

    
    const startUpload = async () => {
        if (encryption) {
            uploadFileEncrypted()
        } else {
            uploadFile()
        }
    }
    const uploadFile = async () => {

        let api = await getLighthouse(address);
        
        const apiKey = await getLighthouse(address);
        const authToken = await lighthouse.dataDepotAuth(apiKey)
        
        
        
        for(let i = 0; i < files.length; i++) {
            const mockEvent = {
                target: {
                    files: [files[i]],
                },
                persist: () => {},
            };
            
            const response = await lighthouse.createCar(mockEvent, authToken.data.access_token);
            
            console.log(response)
 
    
/*     
    
                const endpoint = `https://data-depot.lighthouse.storage/api/upload/upload_files`
                //const content = await readFSStream(mockEvent.target.files[0]);
                
                toast.info(authToken.data.access_token)
                
                const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRzZS1sYW8iLCJhdmF0YXJVUkwiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTA2NjUzMzU5P3Y9NCIsImlhdCI6MTY4NDI3MDk0MCwiZXhwIjoxNjg1OTk4OTQwfQ.v3ph47ry4wi5z_XucAYcCPnXKWKuHx169JsMZjWyJ94"
            
                try {
                    var form = new FormData();
                    files.map((item) => {
                        form.append("file", item);
                    });
                
                    const config = {
                        onUploadProgress: (progressEvent) => {
                        let percentageUploaded =
                            (progressEvent?.loaded / progressEvent?.total) * 100;
                
                        setUploadedProgress(percentageUploaded.toFixed(2));
                        },
                    };
                    let response = await axios.post(
                        `${endpoint}`,
                        form,
                        config, 
                        {headers: {
                            Authorization: `Bearer ${authToken.data.access_token}`,
                        }},
                    );
                
                    if (response["status"] === 200) {
                        console.log(response?.data?.message, "success");
                    }
                    } catch (error) {
                    console.log(`Something Went Wrong : ${error}`, "error");
                    }
     */

        /*     try{
                
                const output = await lighthouse.upload(mockEvent, api, progressCallback);
                
                toast.success("Succesfully uploaded the files");
               // window.location.reload();
            }catch(e){
                toast.error(e.message)
            }
            
     */
     
        }
        
     
               
   
        
        toast.success("Succesfully uploaded the files");

    }

    
    const uploadFileEncrypted = async () => {
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
        
        for(let i = 0; i < files.length; i++) {
            
            const mockEvent = {
                target: {
                    files: [files[i]],
                },
                persist: () => {},
            };
                
     /*        try {
                const response = await lighthouse.uploadEncrypted(
                    mockEvent,
                    api,
                    sig.publicKey,
                    sig.signedMessage,
                    progressCallback
                );
                
                
               // window.location.reload();
    
        }catch(e){
            toast.error(e.message)
        } */
        
        const apiKey = await getLighthouse(address);
        const authToken = await lighthouse.dataDepotAuth(apiKey)


        //88a435ac.75ac6eac41a04a5196f2a7487c2ab186

            const endpoint = `https://data-depot.lighthouse.storage/api/upload/upload_files`
            const content = await readFSStream(mockEvent.target.files[0]);
            
            //convert content to utf8Array
            const utf8Array = new TextEncoder().encode(content);
            console.log(utf8Array)
            console.log(content)
             const formData = new FormData();
            formData.append('file', utf8Array)
            
          
            try {
                var form = new FormData();
                mockEvent.map((item) => {
                    form.append("file", item);
                });
                
                console.log(form);
            
                const config = {
                    onUploadProgress: (progressEvent) => {
                    let percentageUploaded =
                        (progressEvent?.loaded / progressEvent?.total) * 100;
            
                    setUploadedProgress(percentageUploaded.toFixed(2));
                    },
                };
                
                let response = await fetch(endpoint,{
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authToken.data.access_token}`,
                    },
                    body: formData
                })
                console.log(response)
               /*  let response = await axios.post(
                    endpoint,
                    form, 
                    {
                        headers: {
                        Authorization: `Bearer ${authToken.data.access_token}`,
                 }});
                  */
            
                if (response["status"] === 200) {
                    console.log(response?.data?.message, "success");
                }
                } catch (error) {
                console.log(`Something Went Wrong : ${error}`, "error");
                }

            

        /* getMetadataFromFile(carFile);
        console.log(carFile); */
    }

    }

    const changeStatus = (status) => {
        setEncryption(status)
    }

    const removeSelect = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        toast.success("File removed" + index);

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
                                    accept="*"
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
                    onClick={startUpload}
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
