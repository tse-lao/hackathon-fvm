
import SimpleDecrypted from '@/components/application/elements/SimpleDecrypted';
import FileDetailInformation from '@/components/application/files/FileDetailInformation';
import FileSharedWith from '@/components/application/files/FileSharedWith';
import useNftStorage from '@/hooks/useNftStorage';
import { getLighthouse, signAuthMessage } from '@/lib/createLighthouseApi';
import readBlobAsJson, { analyzeJSONStructure, readTextAsJson } from '@/lib/dataHelper';
import Layout from '@/pages/Layout';
import lighthouse from '@lighthouse-web3/sdk';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';



const fileDefault = {
    "fileSizeInBytes": "",
    "cid": "",
    "encryption": false,
    "fileName": "",
    "mimeType": "",
    "txHash": ""
}

// Declare mimeType as constants
const MIMETYPE_IMAGE_JPEG = "image/jpeg";
const MIMETYPE_IMAGE_PNG = "image/png";
const MIMETYPE_APP_JSON = "application/json";
const MIMETYPE_TEXT_PLAIN = "text/plain";
const MIMETYPE_APP_CSV = "application/csv";

export default function ViewFile() {
    const { cid } = useRouter().query;
    const { address } = useAccount();
    const { uploadMetadata } = useNftStorage();

    const [record, setRecord] = useState(
        {
            cid: "",
            metadata: "",
        }
    );

    const [fileInfo, setFileInfo] = useState(fileDefault);
    const [fileURL, setFileURL] = useState(null);
    const [loading, setLoading] = useState(true);

    //get the file info.
    useEffect(() => {
        const getFile = async () => {
            setRecord({ cid: cid, metadata: "" })
            const status = await lighthouse.getFileInfo(cid)
            setFileInfo(status.data);

            if (!status.data.encryption) {
                //TODO: Read the content of the CID and display it.
                const file = cid.toString();
                //read the content of this file 
                cid
                readContent(status.data.mimeType, file);
            }
        }

        if (cid) { getFile(); setLoading(false) }

    }, [cid])

    /* Decrypt file */
    const decrypt = async () => {
        const { signedMessage, publicKey } = await signAuthMessage(address);


        const keyObject = await lighthouse.fetchEncryptionKey(
            cid,
            publicKey,
            signedMessage
        );

        const fileType = fileInfo.mimeType;
        const decrypted = await lighthouse.decryptFile(cid, keyObject.data.key);

        //setFileData(decrypted);

        readContent(fileType, decrypted);

    }


    async function readContent(fileType, content) {
        switch (fileType) {
            case MIMETYPE_IMAGE_JPEG:
                let jpg = URL.createObjectURL(content);
                setFileURL(jpg);
            case MIMETYPE_IMAGE_PNG:
                const url = URL.createObjectURL(content);
                setFileURL(url);
            case MIMETYPE_APP_JSON:
                await readTextAsJson(content, (error, json) => {
                    if (error) {
                        toast.error('Failed to read the Blob as JSON:', error);
                    } else {

                        setFileURL(json)
                    }
                });
            case MIMETYPE_TEXT_PLAIN:
                await readTextAsJson(content, (error, json) => {
                    if (error) {
                        toast.error('Failed to read the Blob as JSON:', error);
                    } else {

                        setFileURL(json)
                    }
                });
            default:
                await readBlobAsJson(content, (error, json) => {
                    if (error) {
                        toast.error('Failed to read the Blob as JSON:', error);
                    } else {

                        setFileURL(json)
                    }
                });
        }
    }

    //TODO: need to fix the download function for the file. 
    function download() {
        // Create an anchor element with the download attribute
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileURL);
        link.download = "filename";

        // Trigger the download by simulating a click event
        document.body.appendChild(link);
        link.click();

        // Clean up the DOM by removing the temporary anchor element
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }, 0);
    }

    async function analyze() {
        const structure = analyzeJSONStructure(fileURL);
        const metadata = await uploadMetadata(JSON.stringify(structure));
        setRecord({
            cid: cid,
            metadata: metadata
        });
    }

    async function createCar() {
        const apiKey = await getLighthouse(address);
        const authToken = await lighthouse.dataDepotAuth(apiKey)

        console.log(authToken)
        // Create CAR
       // const response = await lighthouse.createCar("https://gateway.lighthouse.storage/ipfs/" + file.cid, authToken.data.access_token)

        try {
            const endpoint = `https://data-depot.lighthouse.storage/api/upload/upload_files`


            const formData = new FormData();
            formData.append('file', fileURL);
            
            
        /*     await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${authToken.data.access_token}`,
                    ...formData.getHeaders(),
                }
            }); */

            console.log(authToken.data.access_token)
     const response = await axios.post(endpoint, fileURL, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    ...formData.getHeaders(),
                    Authorization: `Bearer ${authToken.data.access_token}`,
                },
            })
            return { data: response.data.message } 
        } catch (error) {
            throw new Error(error)
        }


    }





    return (
        <Layout>

            {loading ? <div>Loading...</div> : (

                <div>

                    <div className="flex justify-between sm:flex sm:items-center mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{fileInfo.fileName}</h1>
                            <p className="mt-1 text-sm md:text-base text-gray-600">
                                {fileInfo.cid}
                            </p>
                        </div>
                        <div className="space-x-4">
                            <button
                                onClick={createCar}
                                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create Car
                            </button>
                            <button
                                onClick={analyze}
                                className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 border border-gray-300"
                            >
                                Get Metadata
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4">
                        {/* File content */}
                        <div className="flex-grow p-4 bg-white shadow-sm rounded-lg mr-4">
                            {fileInfo.encryption && fileURL == null ? (
                                <SimpleDecrypted startDecrypt={decrypt} />
                            ) : (
                                <div className="prose prose-sm max-w-none max-h-[600px] overflow-auto">
                                    {fileInfo.mimeType == "image/jpeg" && <img src={fileURL} />}
                                    {fileInfo.mimeType == "image/png" && <img src={fileURL} />}
                                    {fileInfo.mimeType == "application/json" && <pre>{JSON.stringify(fileURL, null, 2)}</pre>}
                                    {fileInfo.mimeType == "text/plain" && <pre>{JSON.stringify(fileURL, null, 2)}</pre>}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="w-120 p-4 bg-white shadow-sm rounded-lg flex flex-col gap-8 h-full">
                            <FileDetailInformation detail={fileInfo} className="mt-4 mb-4" metadata={record.metadata} cid={cid} address={address} />
                            <FileSharedWith cid={cid} />
                        </div>
                    </div>
                </div>
            )}
        </Layout>

    )
}
