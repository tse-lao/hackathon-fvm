import SimpleDecrypted from '@/components/application/elements/SimpleDecrypted';
import FileSharedWith from '@/components/application/files/FileSharedWith';
import { signAuthMessage } from '@/lib/createLighthouseApi';
import readBlobAsJson, { analyzeJSONStructure, readBlobAsCsvToJson } from '@/lib/dataManipulation';
import Layout from '@/pages/Layout';
import lighthouse from '@lighthouse-web3/sdk';
import { usePolybase } from '@polybase/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const fileDefault = {
    "fileSizeInBytes": "",
    "cid": "",
    "encryption": false,
    "fileName": "",
    "mimeType": "",
    "txHash": ""
}

export default function ViewFile() {
    const { cid } = useRouter().query;
    const { address } = useAccount();

    const [fileInfo, setFileInfo] = useState(fileDefault);
    const [fileURL, setFileURL] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [inPolybase, setInPolybase] = useState(true);
    const [loading, setLoading] = useState(true);
    const polybase = usePolybase();

    //get the file info.
    useEffect(() => {
        const getFile = async () => {
            const status = await lighthouse.getFileInfo(cid)
            setFileInfo(status.data);
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
        setFileData(decrypted);

        if (fileType == "image/png" || fileType == "image/jpeg") {
            const url = URL.createObjectURL(decrypted);
            setFileURL(url);
        }
        if (fileType == "application/json") {
            await readBlobAsJson(decrypted, (error, json) => {
                if (error) {
                    console.error('Failed to read the Blob as JSON:', error);
                } else {
                    console.log('Parsed JSON:', json);
                    setFileURL(json)
                }
            });
        }

        if (fileType == "application/csv") {

            await readBlobAsCsvToJson(decrypted, (error, json) => {
                if (error) {
                    console.error('Failed to read the Blob as JSON:', error);
                } else {
                    console.log('Parsed JSON:', json);
                    setFileURL(json)
                }
            });
        }


    }

    const dataRecord = async () => {
        try {
            await polybase.collection("File").record("cid").get(cid);
            setInPolybase(true);
        } catch (e) {
            console.log(e);
            setInPolybase(false);

        }


    }
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


        console.log(structure)

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ json: fileURL }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.result);
            setAnimalInput("");
        } catch (error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }




    return (
        <Layout>

            {loading ? <div>Loading...</div> : (

                <div>
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">Your file</h1>
                            <p className="mt-2 text-sm text-gray-700">
                                Please find the file below. If its encrypted you need to sign it.
                            </p>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <button onClick={decrypt}
                                className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >Decrypt</button>

                            <button onClick={download}
                                className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >Download</button>


                            <button onClick={analyze}
                                className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >Get Metadata</button>
                        </div>
                    </div>
                    <div className="flex">
                        {/* File content */}

                        {fileInfo.encryption && !fileData ? (
                            <div className="flex-1 p-4 bg-white border-r border-gray-200">
                            <div className="prose prose-sm max-w-none">
                                <SimpleDecrypted startDecrypt={decrypt} />
                            </div>
                        </div>
                        ) : (
                            <div className="flex-1 p-4 bg-white border-r border-gray-200">
                            <div className="prose prose-sm max-w-none">

                                {fileInfo.mimeType == "image/jpeg" && fileURL && <img src={fileURL} />}
                                {fileInfo.mimeType == "image/png" && <img src={fileURL} />}
                                {fileInfo.mimeType == "application/json" && <pre>{JSON.stringify(fileURL, null, 2)}</pre>}
                            </div>
                        </div>
                            
                        )}


                        {/* Sidebar */}
                        <div className="w-120 p-4 bg-gray-100">
                            <h2 className="text-xl font-semibold mb-4">File Information</h2>
                            <ul className="mb-12">
                                {Object.entries(fileInfo).map((info, index) => (
                                    <li key={index} className="mb-2">
                                        <span className="font-semibold">{info[0]}:</span>
                                        <span className="truncate m-w-full">{info[1]}</span>
                                    </li>
                                ))}
                            </ul>

                            <FileSharedWith cid={cid} />


                        </div>
                    </div>
                </div>
            )}
        </Layout>

    )
}
